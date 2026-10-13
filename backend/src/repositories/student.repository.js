const db = require('../config/db');

const findByUserId = async (userId) => {
  const result = await db.query('SELECT * FROM students WHERE user_id = $1', [userId]);
  return result.rows[0];
};

const findByStudentId = async (studentId) => {
  const result = await db.query('SELECT * FROM students WHERE student_id = $1', [studentId]);
  return result.rows[0];
};

const findByRollNo = async (rollNo) => {
  const result = await db.query('SELECT * FROM students WHERE roll_no = $1', [rollNo]);
  return result.rows[0];
};

const updateByUserId = async (userId, data) => {
  const fields = [];
  const values = [];
  let idx = 1;

  const allowedFields = [
    'first_name', 'last_name', 'personal_email', 'phone', 'gender',
    'branch', 'department', 'division', 'current_year', 'passout_year',
    'address', 'location_zone', 'resume_url', 'linkedin_url', 'github_url', 'skills'
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = $${idx}`);
      values.push(data[field]);
      idx++;
    }
  }

  if (fields.length === 0) return findByUserId(userId);

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(userId);

  const query = `UPDATE students SET ${fields.join(', ')} WHERE user_id = $${idx} RETURNING *`;
  const result = await db.query(query, values);
  return result.rows[0];
};

const addSemesterCgpa = async (studentId, { semester, sgpa, cgpa }) => {
  const result = await db.query(
    `INSERT INTO student_semester_cgpa (student_id, semester, sgpa, cgpa) 
     VALUES ($1, $2, $3, $4) 
     ON CONFLICT (student_id, semester) DO UPDATE SET sgpa = EXCLUDED.sgpa, cgpa = EXCLUDED.cgpa 
     RETURNING *`,
    [studentId, semester, sgpa, cgpa]
  );
  return result.rows[0];
};

const getCgpaRecords = async (studentId) => {
  const result = await db.query(
    'SELECT * FROM student_semester_cgpa WHERE student_id = $1 ORDER BY semester ASC',
    [studentId]
  );
  return result.rows;
};

const findAll = async () => {
  const result = await db.query('SELECT * FROM students ORDER BY student_id DESC');
  return result.rows;
};

module.exports = {
  findByUserId,
  findByStudentId,
  findByRollNo,
  updateByUserId,
  addSemesterCgpa,
  getCgpaRecords,
  findAll
};
