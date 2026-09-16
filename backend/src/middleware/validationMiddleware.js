const { sendError } = require('../utils/apiResponse');

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
  validateBody
};
