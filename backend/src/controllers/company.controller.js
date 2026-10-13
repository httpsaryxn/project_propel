const companyService = require('../services/company.service');
const { sendSuccess } = require('../utils/response');

const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.getAllCompanies(req.query);
    return sendSuccess(res, companies, 'Companies list fetched successfully');
  } catch (error) {
    next(error);
  }
};

const getCompanyById = async (req, res, next) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    return sendSuccess(res, company, 'Company details fetched successfully');
  } catch (error) {
    next(error);
  }
};

const createCompany = async (req, res, next) => {
  try {
    const company = await companyService.createCompany(req.body);
    return sendSuccess(res, company, 'Company created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const company = await companyService.updateCompany(req.params.id, req.body);
    return sendSuccess(res, company, 'Company updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const deleted = await companyService.deleteCompany(req.params.id);
    return sendSuccess(res, deleted, 'Company deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};
