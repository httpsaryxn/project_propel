const studentService = require('../services/student.service');
const { sendSuccess, sendError } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const profile = await studentService.getProfileByUserId(req.user.user_id);
    return sendSuccess(res, profile, 'Student profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updated = await studentService.updateProfile(req.user.user_id, req.body);
    return sendSuccess(res, updated, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

const addSemesterCgpa = async (req, res, next) => {
  try {
    const record = await studentService.addCgpaRecord(req.user.user_id, req.body);
    return sendSuccess(res, record, 'Semester CGPA added successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents(req.query);
    return sendSuccess(res, students, 'Students list fetched');
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, addSemesterCgpa, getAllStudents };
