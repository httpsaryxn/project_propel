const analyticsRepository = require('../repositories/analytics.repository');

const getOverallStats = async () => {
  return analyticsRepository.getOverallStats();
};

module.exports = { getOverallStats };
