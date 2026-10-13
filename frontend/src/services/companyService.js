import API from './api';

export const getCompanies = async (params) => {
  const response = await API.get('/companies', { params });
  return response.data;
};

export const getCompanyById = async (id) => {
  const response = await API.get(`/companies/${id}`);
  return response.data;
};

export const createCompany = async (companyData) => {
  const response = await API.post('/companies', companyData);
  return response.data;
};

export const updateCompany = async (id, companyData) => {
  const response = await API.put(`/companies/${id}`, companyData);
  return response.data;
};

export const deleteCompany = async (id) => {
  const response = await API.delete(`/companies/${id}`);
  return response.data;
};
