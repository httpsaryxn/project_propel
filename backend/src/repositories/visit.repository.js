const db = require('../config/db');

const findAllVisits = async () => {
  const query = `
    SELECT 
      cv.*,
      c.company_name, c.job_profile, c.package_lpa, c.location
    FROM company_visits cv
    JOIN companies c ON cv.company_id = c.company_id
    ORDER BY cv.visit_date ASC
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
