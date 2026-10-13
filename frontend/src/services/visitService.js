import API from './api';

export const getVisits = async () => {
  const response = await API.get('/company-visits');
  return response.data;
};

export const scheduleVisit = async (visitData) => {
  const response = await API.post('/company-visits', visitData);
  return response.data;
};
