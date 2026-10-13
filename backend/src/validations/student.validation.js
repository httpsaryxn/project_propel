const { body } = require('express-validator');

const updateProfileValidation = [
  body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
  body('last_name').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required')
];

module.exports = { updateProfileValidation };
