const studentRepository = require('../repositories/student.repository');

const getProfileByUserId = async (userId) => {
  return studentRepository.findByUserId(userId);
};

const updateProfile = async (userId, data) => {
  return studentRepository.updateByUserId(userId, data);
};

const updateAcademicCriteria = async (userId, data) => {
  const student = await studentRepository.findByUserId(userId);
  if (!student) {
    const error = new Error('Student profile not found');
    error.statusCode = 404;
    throw error;
  }
  return studentRepository.updateAcademicCriteria(userId, data);
};

const addCgpaRecord = async (userId, data) => {
  const student = await studentRepository.findByUserId(userId);
  if (!student) {
    const error = new Error('Student profile not found');
    error.statusCode = 404;
    throw error;
  }
  return studentRepository.addSemesterCgpa(student.student_id, data);
};

const getAllStudents = async (query) => {
  return studentRepository.findAll(query);
};

module.exports = {
  getProfileByUserId,
  updateProfile,
  updateAcademicCriteria,
  addCgpaRecord,
  getAllStudents
};
