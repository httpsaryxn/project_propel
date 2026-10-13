const db = require('../config/db');

const getMyOffers = async (studentId) => {
  const query = `
    SELECT 
      o.offer_id, o.package_lpa, o.offer_date, o.accepted,
      c.company_id, c.company_name, c.job_profile, c.location
    FROM offers o
    JOIN companies c ON o.company_id = c.company_id
    WHERE o.student_id = $1
    ORDER BY o.offer_date DESC
  `;
  const result = await db.query(query, [studentId]);
  return result.rows;
};

const respondToOffer = async (offerId, studentId, accepted) => {
  const query = `
    UPDATE offers
    SET accepted = $1
    WHERE offer_id = $2 AND student_id = $3
    RETURNING *
  `;
  const result = await db.query(query, [accepted, offerId, studentId]);
  return result.rows[0];
};

const createOffer = async ({ student_id, company_id, package_lpa }) => {
  const query = `
    INSERT INTO offers (student_id, company_id, package_lpa, offer_date, accepted)
    VALUES ($1, $2, $3, CURRENT_DATE, FALSE)
    ON CONFLICT (student_id, company_id) DO UPDATE 
    SET package_lpa = EXCLUDED.package_lpa
    RETURNING *
  `;
  const result = await db.query(query, [student_id, company_id, package_lpa]);
  return result.rows[0];
};

module.exports = {
  getMyOffers,
  respondToOffer,
  createOffer
};
