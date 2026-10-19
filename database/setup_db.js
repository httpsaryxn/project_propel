const fs = require('fs');
const path = require('path');

// Resolve pg and dotenv from backend node_modules if not in root
let pg, dotenv;
try {
  pg = require('pg');
  dotenv = require('dotenv');
} catch (e) {
  pg = require(path.join(__dirname, '../backend/node_modules/pg'));
  dotenv = require(path.join(__dirname, '../backend/node_modules/dotenv'));
}

const { Client } = pg;

// Load environment variables from root and backend .env files
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/project_propel';

console.log('🚀 Starting Project Propel Database Setup...');
console.log(`📡 Connecting to: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);

async function runSetup() {
  let targetDbName = 'project_propel';
  let host = 'localhost';
  let port = 5432;
  let user = 'postgres';
  let password = 'password';

  try {
    const urlObj = new URL(connectionString);
    targetDbName = urlObj.pathname.substring(1) || 'project_propel';
    host = urlObj.hostname || 'localhost';
    port = urlObj.port || 5432;
    user = urlObj.username || 'postgres';
    password = decodeURIComponent(urlObj.password || '');
  } catch (e) {
    console.warn('⚠️ Could not parse DATABASE_URL as URL, falling back to connection string.');
  }

  const isRemote = host !== 'localhost' && host !== '127.0.0.1';

  // Step 1: If running locally, ensure target database exists
  if (!isRemote) {
    const rootClient = new Client({
      user,
      password,
      host,
      port,
      database: 'postgres'
    });

    try {
      await rootClient.connect();
      console.log('✅ Connected to local PostgreSQL server.');

      // Check if target database exists
      const res = await rootClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [targetDbName]);
      if (res.rows.length === 0) {
        console.log(`📦 Database "${targetDbName}" does not exist. Creating database...`);
        await rootClient.query(`CREATE DATABASE "${targetDbName}"`);
        console.log(`✨ Database "${targetDbName}" created successfully!`);
      } else {
        console.log(`ℹ️ Database "${targetDbName}" already exists.`);
      }
    } catch (err) {
      console.error('❌ Error checking/creating local database:', err.message);
      process.exit(1);
    } finally {
      await rootClient.end();
    }
  } else {
    console.log(`☁️ Remote cloud database detected (${host}). Connecting with SSL directly...`);
  }

  // Step 2: Connect to target database and run migration scripts
  const dbClient = new Client({
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : false
  });

  try {
    await dbClient.connect();
    console.log(`🔗 Connected directly to "${targetDbName}". Executing SQL scripts...\n`);

    const sqlFiles = [
      'schema.sql',
      'constraints.sql',
      'indexes.sql',
      'views.sql',
      'functions.sql',
      'procedures.sql',
      'triggers.sql',
      'seed.sql'
    ];

    for (const fileName of sqlFiles) {
      const filePath = path.join(__dirname, fileName);
      if (fs.existsSync(filePath)) {
        const sqlContent = fs.readFileSync(filePath, 'utf8');
        console.log(`⏳ Executing ${fileName}...`);
        try {
          await dbClient.query(sqlContent);
          console.log(`  └─ ✅ ${fileName} executed successfully.`);
        } catch (fileErr) {
          if (fileErr.message.includes('already exists') || fileErr.code === '42710' || fileErr.code === '23505') {
            console.log(`  └─ ℹ️ ${fileName}: objects/constraints already exist, continuing.`);
          } else {
            console.warn(`  └─ ⚠️ ${fileName} notice: ${fileErr.message}`);
          }
        }
      } else {
        console.warn(`  └─ ⚠️ File not found: ${fileName}`);
      }
    }

    console.log('\n==================================================');
    console.log('🎉 DATABASE SETUP & MIGRATION COMPLETE!');
    console.log('==================================================\n');

    // List all tables created
    const tablesRes = await dbClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log(`📋 Base Tables Created (${tablesRes.rows.length}):`);
    tablesRes.rows.forEach((row, i) => console.log(`  ${i + 1}. ${row.table_name}`));

    // List all views created
    const viewsRes = await dbClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'VIEW'
      ORDER BY table_name;
    `);

    console.log(`\n👁️ Views Created (${viewsRes.rows.length}):`);
    viewsRes.rows.forEach((row, i) => console.log(`  ${i + 1}. ${row.table_name}`));

    // List triggers created
    const triggersRes = await dbClient.query(`
      SELECT trigger_name, event_object_table 
      FROM information_schema.triggers 
      WHERE trigger_schema = 'public'
      ORDER BY trigger_name;
    `);

    console.log(`\n⚡ Triggers Created (${triggersRes.rows.length}):`);
    triggersRes.rows.forEach((row, i) => console.log(`  ${i + 1}. ${row.trigger_name} (on table: ${row.event_object_table})`));

  } catch (err) {
    console.error('❌ SQL Execution Failed:', err.message);
  } finally {
    await dbClient.end();
  }
}

runSetup();
