const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

/**
 * Validates request payload against required or disallowed fields
 */
const validateBody = (validatorFn) => {
  return (req, res, next) => {
    const { isValid, errors } = validatorFn(req.body);
    if (!isValid) {
      return sendError(res, 'Validation failed', errors, 400);
    }
    next();
  };
};

module.exports = {
  validateResult,
  validate: validateResult,
  validateBody
};
