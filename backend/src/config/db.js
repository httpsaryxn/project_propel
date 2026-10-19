const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

// Auto-detect remote hosts (Supabase, Neon, Render, Railway, AWS RDS, etc.) to enforce SSL
const isLocalhost =
  !connectionString ||
  connectionString.includes('localhost') ||
  connectionString.includes('127.0.0.1');

const pool = new Pool({
  connectionString: connectionString || undefined,
  ssl: !isLocalhost ? { rejectUnauthorized: false } : false
});

const query = async (text, params) => {
  if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
    throw new Error(
      'DATABASE_URL environment variable is missing on Vercel. ' +
      'Please add your hosted PostgreSQL connection string (from Supabase, Neon, etc.) to Vercel Project Settings > Environment Variables.'
    );
  }
  return pool.query(text, params);
};

const testConnection = async () => {
  if (!process.env.DATABASE_URL) {
    console.warn(
      '⚠️ [Database Warning] DATABASE_URL is not set. ' +
      'If deployed on Vercel, this will cause ECONNREFUSED 127.0.0.1:5432. ' +
      'Please configure DATABASE_URL in Vercel Project Settings -> Environment Variables.'
    );
  }
  const client = await pool.connect();
  try {
    await client.query('SELECT NOW()');
  } finally {
    client.release();
  }
};

module.exports = {
  query,
  pool,
  testConnection
};
