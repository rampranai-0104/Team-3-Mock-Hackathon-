const { sendError } = require('../utils/apiResponse');

/**
 * Middleware to authorize specific user roles
 * @param  {...string} allowedRoles - List of allowed role strings
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'User authentication required.', null, 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
        null,
        403
      );
    }

    next();
  };
};

module.exports = {
  authorizeRoles
};
