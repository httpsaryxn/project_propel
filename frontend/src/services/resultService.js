import API from './api';

export const getMyResults = async () => {
  const response = await API.get('/results/my');
  return response.data;
};

export const getCompanyResults = async (companyId) => {
  const response = await API.get(`/results/company/${companyId}`);
  return response.data;
};

export const updateResult = async (resultData) => {
  const response = await API.post('/results/upload', resultData);
  return response.data;
};
