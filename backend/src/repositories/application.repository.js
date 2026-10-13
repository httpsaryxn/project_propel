const db = require('../config/db');

const getEligibleCompaniesForStudent = async (studentId) => {
  const query = `
    SELECT 
      c.company_id, c.company_name, c.job_profile, c.job_description, 
      c.package_lpa, c.job_type, c.location, c.visit_date, c.status AS drive_status,
      cc.minimum_cgpa, cc.maximum_backlogs, cc.gender_requirement,
      a.application_id, a.status AS application_status, a.applied_on
    FROM companies c
    JOIN company_criteria cc ON c.company_id = cc.company_id
    LEFT JOIN applications a ON c.company_id = a.company_id AND a.student_id = $1
    WHERE check_student_eligibility($1, c.company_id) = TRUE
    ORDER BY c.package_lpa DESC
  `;
  const result = await db.query(query, [studentId]);
  return result.rows;
};

const applyForCompany = async (studentId, companyId) => {
  // Call PL/pgSQL function apply_student
  const query = `SELECT apply_student($1, $2) AS message`;
  const result = await db.query(query, [studentId, companyId]);
  return result.rows[0];
};

const getMyApplications = async (studentId) => {
  const query = `
    SELECT 
      a.application_id, a.status, a.applied_on,
      c.company_id, c.company_name, c.job_profile, c.package_lpa, c.location, c.visit_date
    FROM applications a
    JOIN companies c ON a.company_id = c.company_id
    WHERE a.student_id = $1
    ORDER BY a.applied_on DESC
  `;
  const result = await db.query(query, [studentId]);
  return result.rows;
};

const getCompanyApplications = async (companyId) => {
  const query = `
    SELECT 
      a.application_id, a.status, a.applied_on,
      s.student_id, s.roll_no, s.first_name, s.last_name, s.college_email, s.phone, s.branch, s.current_year, s.location_zone,
      COALESCE((SELECT MAX(cgpa) FROM student_semester_cgpa WHERE student_id = s.student_id), 0.00) AS latest_cgpa
    FROM applications a
    JOIN students s ON a.student_id = s.student_id
    WHERE a.company_id = $1
    ORDER BY a.applied_on DESC
  `;
  const result = await db.query(query, [companyId]);
  return result.rows;
};

const updateStatus = async (applicationId, status) => {
  const query = `
    UPDATE applications
    SET status = $1
    WHERE application_id = $2
    RETURNING *
  `;
  const result = await db.query(query, [status, applicationId]);
  return result.rows[0];
};

const bulkUpdateStatus = async (companyId, studentIds, status) => {
  const query = `
    UPDATE applications
    SET status = $1
    WHERE company_id = $2 AND student_id = ANY($3::int[])
    RETURNING *
  `;
  const result = await db.query(query, [status, companyId, studentIds]);
  return result.rows;
};

module.exports = {
  getEligibleCompaniesForStudent,
  applyForCompany,
  getMyApplications,
  getCompanyApplications,
  updateStatus,
  bulkUpdateStatus
};
