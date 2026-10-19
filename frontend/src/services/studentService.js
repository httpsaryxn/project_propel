import API from './api';

export const getProfile = async () => {
  const response = await API.get('/students/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put('/students/profile', profileData);
  return response.data;
};

export const updateAcademicCriteria = async (criteriaData) => {
  const response = await API.put('/students/academic-criteria', criteriaData);
  return response.data;
};

export const uploadResumeFile = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await API.post('/students/upload-resume', formData);
  return response.data;
};

export const addCgpaRecord = async (cgpaData) => {
  const response = await API.post('/students/cgpa', cgpaData);
  return response.data;
};

export const getAllStudents = async (params) => {
  const response = await API.get('/students', { params });
  return response.data;
};
