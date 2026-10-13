const visitService = require('../services/visit.service');
const { sendSuccess } = require('../utils/response');

const getAllVisits = async (req, res, next) => {
  try {
    const visits = await visitService.getAllVisits();
    return sendSuccess(res, visits, 'Company visits list');
  } catch (error) {
    next(error);
  }
};

const scheduleVisit = async (req, res, next) => {
  try {
    const visit = await visitService.scheduleVisit(req.body);
    return sendSuccess(res, visit, 'Company visit scheduled successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVisits,
  scheduleVisit
};
