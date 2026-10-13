const db = require('../config/db');

const findAllVisits = async () => {
  const query = `
    SELECT 
      COALESCE(cv.visit_id, c.company_id) AS visit_id,
      c.company_id,
      c.company_name,
      c.job_profile,
      c.package_lpa,
      COALESCE(cv.venue, c.location, 'Campus Placement Cell') AS venue,
      COALESCE(cv.visit_date, c.visit_date) AS visit_date,
      COALESCE(cv.description, c.job_description, 'Campus Placement Drive') AS description,
      c.status,
      c.location
    FROM companies c
    LEFT JOIN company_visits cv ON c.company_id = cv.company_id
    WHERE c.visit_date IS NOT NULL OR cv.visit_date IS NOT NULL
    ORDER BY COALESCE(cv.visit_date, c.visit_date) ASC
  `;
  const result = await db.query(query);
  return result.rows;
};

const createVisit = async (data) => {
  const query = `
    INSERT INTO company_visits (company_id, visit_date, venue, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const result = await db.query(query, [
    data.company_id,
    data.visit_date,
    data.venue,
    data.description || null
  ]);
  return result.rows[0];
};

module.exports = {
  findAllVisits,
  createVisit
};
