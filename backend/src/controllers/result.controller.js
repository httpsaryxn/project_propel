const resultService = require('../services/result.service');
const { sendSuccess } = require('../utils/response');

const getMyResults = async (req, res, next) => {
  try {
    const results = await resultService.getMyResults(req.user.user_id);
    return sendSuccess(res, results, 'My results list');
  } catch (error) {
    next(error);
  }
};

const getCompanyResults = async (req, res, next) => {
  try {
    const results = await resultService.getCompanyResults(req.params.companyId);
    return sendSuccess(res, results, 'Company evaluation results list');
  } catch (error) {
    next(error);
  }
};

const uploadResults = async (req, res, next) => {
  try {
    const result = await resultService.updateResult(req.body);
    return sendSuccess(res, result, 'Candidate result updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyResults,
  getCompanyResults,
  uploadResults
};
