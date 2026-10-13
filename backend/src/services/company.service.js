const companyRepository = require('../repositories/company.repository');

const getAllCompanies = async (filters) => {
  return companyRepository.findAll(filters);
};

const getCompanyById = async (id) => {
  const company = await companyRepository.findById(id);
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }
  return company;
};

const createCompany = async (data) => {
  return companyRepository.createCompany(data);
};

const updateCompany = async (id, data) => {
  const existing = await companyRepository.findById(id);
  if (!existing) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }
  return companyRepository.updateCompany(id, data);
};

const deleteCompany = async (id) => {
  const existing = await companyRepository.findById(id);
  if (!existing) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }
  return companyRepository.deleteCompany(id);
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};
