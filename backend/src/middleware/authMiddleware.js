const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');

/**
 * Unified JWT Authentication Middleware
 * Supports Header (Bearer), Cookies, and fallback secret keys
 */
const authenticateJWT = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendError(res, 'Authentication required. No token provided.', null, 401);
    }

    const secret = process.env.JWT_SECRET || 'tvarita_super_secret_jwt_key_2026_dev';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      // Fallback try with secondary default secret if dev key differs
      try {
        decoded = jwt.verify(token, 'tvarita_arts_collective_jwt_secret_dev_2026');
      } catch (err2) {
        return sendError(res, 'Invalid or expired token.', null, 401);
      }
    }

    const user = await User.findById(decoded.id).select('-password -passwordHash');
    if (!user) {
      return sendError(res, 'User associated with token no longer exists.', null, 401);
    }

    if (user.status === 'suspended' || user.status === 'inactive' || user.isActive === false) {
      return sendError(res, `Account is inactive or suspended. Access denied.`, null, 403);
    }

    req.userId = user._id;
    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Authentication failed.', error.message, 401);
  }
};

/**
 * Optional Authentication for guest/public routes
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'tvarita_super_secret_jwt_key_2026_dev';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      decoded = jwt.verify(token, 'tvarita_arts_collective_jwt_secret_dev_2026');
    }

    const user = await User.findById(decoded.id).select('-password -passwordHash');
    if (user && user.status !== 'suspended' && user.status !== 'inactive' && user.isActive !== false) {
      req.userId = user._id;
      req.user = user;
    }
  } catch (err) {
    // Proceed as unauthenticated guest
  }

  next();
};

const authMiddleware = authenticateJWT;
authMiddleware.protect = authenticateJWT;
authMiddleware.authenticateJWT = authenticateJWT;
authMiddleware.authMiddleware = authenticateJWT;
authMiddleware.optionalAuth = optionalAuth;

module.exports = authMiddleware;
