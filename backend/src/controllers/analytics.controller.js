const { sendSuccess } = require('../utils/response');

const getOverallStats = async (req, res, next) => {
  try {
    return sendSuccess(res, {
      total_registered_students: 0,
      total_placed_students: 0,
      placement_percentage: 0,
      highest_package_lpa: 0,
      average_package_lpa: 0
    }, 'Overall placement stats');
  } catch (error) {
    next(error);
  }
};

const getCompanyStats = async (req, res, next) => {
  try {
    return sendSuccess(res, [], 'Company-wise statistics');
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverallStats, getCompanyStats };
