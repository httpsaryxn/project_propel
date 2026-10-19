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
    'address', 'location_zone', 'resume_url', 'linkedin_url', 'github_url', 'skills',
    'cgpa', 'tenth_percentage', 'twelfth_percentage', 'diploma_percentage',
    'active_backlogs', 'total_backlogs', 'academic_recorded'
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

const updateAcademicCriteria = async (userId, data) => {
  const query = `
    UPDATE students SET
      cgpa = $1,
      tenth_percentage = $2,
      twelfth_percentage = $3,
      diploma_percentage = $4,
      active_backlogs = $5,
      total_backlogs = $6,
      academic_recorded = TRUE,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $7
    RETURNING *
  `;
  const result = await db.query(query, [
    data.cgpa,
    data.tenth_percentage,
    data.twelfth_percentage || 0,
    data.diploma_percentage || 0,
    data.active_backlogs || 0,
    data.total_backlogs || 0,
    userId
  ]);

  const student = result.rows[0];
  if (student && data.cgpa) {
    // Also record in student_semester_cgpa semester 6/current_year for analytics and views
    await db.query(`
      INSERT INTO student_semester_cgpa (student_id, semester, sgpa, cgpa)
      VALUES ($1, 6, $2, $2)
      ON CONFLICT (student_id, semester) DO UPDATE SET cgpa = EXCLUDED.cgpa, sgpa = EXCLUDED.sgpa
    `, [student.student_id, data.cgpa]);
  }

  return student;
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
  updateAcademicCriteria,
  addSemesterCgpa,
  getCgpaRecords,
  findAll
};
