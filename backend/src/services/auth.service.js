const userRepository = require('../repositories/user.repository');
const studentRepository = require('../repositories/student.repository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const registerUser = async (data) => {
  // Check email uniqueness
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) {
    const error = new Error('An account already exists with this email address.');
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await hashPassword(data.password);

  // 1. Register T&P Coordinator
  if (data.role === 'coordinator') {
    const newCoordinator = await userRepository.createCoordinatorUser({
      email: data.email,
      passwordHash
    });

    const token = generateToken({
      user_id: newCoordinator.user_id,
      email: newCoordinator.email,
      role: newCoordinator.role,
      student_id: null
    });

    return {
      token,
      user: {
        user_id: newCoordinator.user_id,
        email: newCoordinator.email,
        role: newCoordinator.role
      }
    };
  }

  // 2. Register Student
  // Check roll number for student
  if (!data.roll_no) {
    const error = new Error('Roll Number is required for student registration.');
    error.statusCode = 400;
    throw error;
  }

  const existingRoll = await studentRepository.findByRollNo(data.roll_no);
  if (existingRoll) {
    const error = new Error('A student already exists with this Roll Number.');
    error.statusCode = 400;
    throw error;
  }

  const newUser = await userRepository.createStudentUser({
    ...data,
    passwordHash
  });

  const studentId = newUser.student_profile ? newUser.student_profile.student_id : null;
  const token = generateToken({
    user_id: newUser.user_id,
    email: newUser.email,
    role: newUser.role,
    student_id: studentId
  });

  return {
    token,
    user: {
      user_id: newUser.user_id,
      email: newUser.email,
      role: newUser.role,
      student_profile: newUser.student_profile
    }
  };
};

const loginUser = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  let studentProfile = null;
  let studentId = null;

  if (user.role === 'student') {
    studentProfile = await studentRepository.findByUserId(user.user_id);
    if (studentProfile) {
      studentId = studentProfile.student_id;
    }
  }

  const token = generateToken({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    student_id: studentId
  });

  await userRepository.updateLastLogin(user.user_id);

  return {
    token,
    user: {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      student_profile: studentProfile
    }
  };
};

const getUserById = async (userId) => {
  const userWithProfile = await userRepository.findUserWithProfile(userId);
  if (!userWithProfile) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  return userWithProfile;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById
};
