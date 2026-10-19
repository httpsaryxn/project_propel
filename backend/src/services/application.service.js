const applicationRepository = require('../repositories/application.repository');
const studentRepository = require('../repositories/student.repository');

const getEligibleCompanies = async (userId) => {
  const student = await studentRepository.findByUserId(userId);
  if (!student) {
    const error = new Error('Student profile not found');
    error.statusCode = 404;
    throw error;
  }
  return applicationRepository.getStudentDrivesWithEligibility(student.student_id);
};

const applyForCompany = async (userId, applicationData) => {
  const student = await studentRepository.findByUserId(userId);
  if (!student) {
    const error = new Error('Student profile not found. Please complete profile first.');
    error.statusCode = 404;
    throw error;
  }
  return applicationRepository.applyForCompany(student.student_id, applicationData);
};

const getMyApplications = async (userId) => {
  const student = await studentRepository.findByUserId(userId);
  if (!student) {
    const error = new Error('Student profile not found');
    error.statusCode = 404;
    throw error;
  }
  return applicationRepository.getMyApplications(student.student_id);
};

const getCompanyApplications = async (companyId) => {
  return applicationRepository.getCompanyApplications(companyId);
};

const updateStatus = async (applicationId, status) => {
  return applicationRepository.updateStatus(applicationId, status);
};

const bulkUpdateStatus = async (companyId, studentIds, status) => {
  return applicationRepository.bulkUpdateStatus(companyId, studentIds, status);
};

module.exports = {
  getEligibleCompanies,
  applyForCompany,
  getMyApplications,
  getCompanyApplications,
  updateStatus,
  bulkUpdateStatus
};
