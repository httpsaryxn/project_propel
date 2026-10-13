const { body } = require('express-validator');

const companyValidation = [
  body('company_name').notEmpty().withMessage('Company name is required'),
  body('job_profile').notEmpty().withMessage('Job profile is required'),
  body('package_lpa').isFloat({ gt: 0 }).withMessage('Package LPA must be a positive number')
];

module.exports = { companyValidation };
