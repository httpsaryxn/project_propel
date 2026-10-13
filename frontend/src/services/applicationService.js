import API from './api';

export const getEligibleCompanies = async () => {
  const response = await API.get('/applications/eligible');
  return response.data;
};

export const applyCompany = async (companyId) => {
  const response = await API.post('/applications/apply', { company_id: companyId });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await API.get('/applications/my');
  return response.data;
};

export const getCompanyApplications = async (companyId) => {
  const response = await API.get(`/applications/company/${companyId}`);
  return response.data;
};

export const updateStatus = async (applicationId, status) => {
  const response = await API.patch(`/applications/${applicationId}/status`, { status });
  return response.data;
};

export const bulkUpdateStatus = async (companyId, studentIds, status) => {
  const response = await API.post('/applications/bulk-status', {
    company_id: companyId,
    student_ids: studentIds,
    status
  });
  return response.data;
};
