const db = require('../config/db');

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findById = async (id) => {
  const result = await db.query(
    'SELECT user_id, email, role, created_at, last_login FROM users WHERE user_id = $1',
    [id]
  );
  return result.rows[0];
};

const findUserWithProfile = async (id) => {
  const userResult = await db.query(
    'SELECT user_id, email, role, created_at, last_login FROM users WHERE user_id = $1',
    [id]
  );
  const user = userResult.rows[0];
  if (!user) return null;

  if (user.role === 'student') {
    const studentResult = await db.query('SELECT * FROM students WHERE user_id = $1', [id]);
    user.student_profile = studentResult.rows[0] || null;
  }
  return user;
};

const createStudentUser = async (data) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert User
    const userRes = await client.query(
      `INSERT INTO users (email, password_hash, role) 
       VALUES ($1, $2, 'student') 
       RETURNING user_id, email, role, created_at`,
      [data.email, data.passwordHash]
    );
    const newUser = userRes.rows[0];

    // 2. Insert Student Details
    const studentRes = await client.query(
      `INSERT INTO students (
        user_id, roll_no, first_name, last_name, college_email, personal_email, 
        phone, gender, branch, department, division, current_year, passout_year, 
        address, location_zone, skills
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
      RETURNING *`,
      [
        newUser.user_id,
        data.roll_no,
        data.first_name,
        data.last_name,
        data.email,
        data.personal_email || null,
        data.phone || null,
        data.gender || 'Other',
        data.branch,
        data.department || data.branch,
        data.division || 'A',
        data.current_year || 4,
        data.passout_year,
        data.address || null,
        data.location_zone || 'Other',
        data.skills || []
      ]
    );

    await client.query('COMMIT');
    newUser.student_profile = studentRes.rows[0];
    return newUser;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const createCoordinatorUser = async ({ email, passwordHash }) => {
  const result = await db.query(
    `INSERT INTO users (email, password_hash, role) 
     VALUES ($1, $2, 'coordinator') 
     RETURNING user_id, email, role, created_at`,
    [email, passwordHash]
  );
  return result.rows[0];
};

const updateLastLogin = async (id) => {
  await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1', [id]);
};

module.exports = {
  findByEmail,
  findById,
  findUserWithProfile,
  createStudentUser,
  createCoordinatorUser,
  updateLastLogin
};
