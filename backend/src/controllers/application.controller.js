const applicationService = require('../services/application.service');
const { sendSuccess } = require('../utils/response');

const getEligibleCompanies = async (req, res, next) => {
  try {
    const companies = await applicationService.getEligibleCompanies(req.user.user_id);
    return sendSuccess(res, companies, 'Eligible companies list fetched');
  } catch (error) {
    next(error);
  }
};

const applyForCompany = async (req, res, next) => {
  try {
    const result = await applicationService.applyForCompany(req.user.user_id, req.body.company_id);
    return sendSuccess(res, result, 'Application submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getMyApplications(req.user.user_id);
    return sendSuccess(res, applications, 'My applications list');
  } catch (error) {
    next(error);
  }
};

const getCompanyApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getCompanyApplications(req.params.companyId);
    return sendSuccess(res, applications, 'Company applications list');
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const updated = await applicationService.updateStatus(req.params.id, req.body.status);
    return sendSuccess(res, updated, 'Application status updated');
  } catch (error) {
    next(error);
  }
};

const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { company_id, student_ids, status } = req.body;
    const result = await applicationService.bulkUpdateStatus(company_id, student_ids, status);
    return sendSuccess(res, result, 'Bulk status updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEligibleCompanies,
  applyForCompany,
  getMyApplications,
  getCompanyApplications,
  updateStatus,
  bulkUpdateStatus
};
