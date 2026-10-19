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

const updateAcademicCriteria = async (req, res, next) => {
  try {
    const updated = await studentService.updateAcademicCriteria(req.user.user_id, req.body);
    return sendSuccess(res, updated, 'Academic criteria recorded successfully');
  } catch (error) {
    next(error);
  }
};

const storageService = require('../services/storage.service');

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'Please choose a resume file to upload', 400);
    }
    const uploadResult = await storageService.uploadResume(req.file, req.user.user_id);
    await studentService.updateProfile(req.user.user_id, { resume_url: uploadResult.resume_url });
    return sendSuccess(
      res,
      {
        resume_url: uploadResult.resume_url,
        filename: req.file.originalname,
        storage_type: uploadResult.storage_type
      },
      'Resume uploaded successfully'
    );
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

module.exports = {
  getProfile,
  updateProfile,
  updateAcademicCriteria,
  uploadResume,
  addSemesterCgpa,
  getAllStudents
};
