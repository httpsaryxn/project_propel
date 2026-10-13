const db = require('../config/db');
const offerRepository = require('./offer.repository');

const getMyResults = async (studentId) => {
  const query = `
    SELECT 
      pr.result_id, pr.round_1, pr.round_2, pr.technical, pr.hr, pr.final_result,
      c.company_id, c.company_name, c.job_profile, c.package_lpa
    FROM placement_results pr
    JOIN companies c ON pr.company_id = c.company_id
    WHERE pr.student_id = $1
  `;
  const result = await db.query(query, [studentId]);
  return result.rows;
};

const getCompanyResults = async (companyId) => {
  const query = `
    SELECT 
      pr.result_id, pr.round_1, pr.round_2, pr.technical, pr.hr, pr.final_result,
      s.student_id, s.roll_no, s.first_name, s.last_name, s.branch
    FROM applications a
    JOIN students s ON a.student_id = s.student_id
    LEFT JOIN placement_results pr ON a.company_id = pr.company_id AND a.student_id = pr.student_id
    WHERE a.company_id = $1
  `;
  const result = await db.query(query, [companyId]);
  return result.rows;
};

const updateResult = async ({ student_id, company_id, round_1, round_2, technical, hr, final_result }) => {
  const query = `
    INSERT INTO placement_results (student_id, company_id, round_1, round_2, technical, hr, final_result)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (student_id, company_id) DO UPDATE SET
      round_1 = EXCLUDED.round_1,
      round_2 = EXCLUDED.round_2,
      technical = EXCLUDED.technical,
      hr = EXCLUDED.hr,
      final_result = EXCLUDED.final_result
    RETURNING *
  `;
  const result = await db.query(query, [
    student_id, company_id,
    round_1 || 'Pending',
    round_2 || 'Pending',
    technical || 'Pending',
    hr || 'Pending',
    final_result || 'Pending'
  ]);

  const updatedRecord = result.rows[0];

  // If candidate is selected, automatically generate offer letter
  if (final_result === 'Selected' || final_result === 'Cleared') {
    const compRes = await db.query('SELECT package_lpa FROM companies WHERE company_id = $1', [company_id]);
    const pkg = compRes.rows[0]?.package_lpa || 0;
    await offerRepository.createOffer({
      student_id,
      company_id,
      package_lpa: pkg
    });
  }

  return updatedRecord;
};

module.exports = {
  getMyResults,
  getCompanyResults,
  updateResult
};
