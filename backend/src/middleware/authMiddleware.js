const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');

/**
 * Middleware to authenticate JWT access tokens
 */
const authenticateJWT = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Authentication required. No token provided.', null, 401);
    }

    const secret = process.env.JWT_SECRET || 'tvarita_super_secret_jwt_key_2026_dev';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return sendError(res, 'Invalid or expired token.', null, 401);
    }

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return sendError(res, 'User associated with token no longer exists.', null, 401);
    }

    if (user.status === 'suspended' || user.status === 'inactive') {
      return sendError(res, `Account is ${user.status}. Access denied.`, null, 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Authentication failed.', error.message, 401);
  }
};

module.exports = {
  authenticateJWT,
  protect: authenticateJWT
};
