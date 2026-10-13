const db = require('../config/db');

const getOverallStats = async () => {
  const result = await db.query('SELECT * FROM placement_statistics');
  return result.rows[0];
};

module.exports = { getOverallStats };
