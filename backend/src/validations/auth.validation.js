const { body } = require('express-validator');

const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['student', 'coordinator']).withMessage('Invalid registration role'),
  
  // Conditional Student Validations
  body('roll_no')
    .if(body('role').not().equals('coordinator'))
    .notEmpty()
    .withMessage('Roll Number is required for student registration'),
  body('first_name')
    .if(body('role').not().equals('coordinator'))
    .notEmpty()
    .withMessage('First Name is required for student registration'),
  body('last_name')
    .if(body('role').not().equals('coordinator'))
    .notEmpty()
    .withMessage('Last Name is required for student registration'),
  body('branch')
    .if(body('role').not().equals('coordinator'))
    .notEmpty()
    .withMessage('Branch is required for student registration'),
  body('passout_year')
    .if(body('role').not().equals('coordinator'))
    .isInt({ min: 2020, max: 2100 })
    .withMessage('Valid passout year is required for student registration')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

module.exports = { registerValidation, loginValidation };
