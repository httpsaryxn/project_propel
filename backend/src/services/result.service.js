const resultRepository = require('../repositories/result.repository');
const studentRepository = require('../repositories/student.repository');

const getMyResults = async (userId) => {
  const student = await studentRepository.findByUserId(userId);
  if (!student) {
    const error = new Error('Student profile not found');
    error.statusCode = 404;
    throw error;
  }
  return resultRepository.getMyResults(student.student_id);
};

const getCompanyResults = async (companyId) => {
  return resultRepository.getCompanyResults(companyId);
};

const updateResult = async (data) => {
  return resultRepository.updateResult(data);
};

module.exports = {
  getMyResults,
  getCompanyResults,
  updateResult
};
