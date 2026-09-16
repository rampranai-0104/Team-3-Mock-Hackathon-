const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            message: 'Not authorized to access this route'
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.userId = decoded.id;
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user || !req.user.isActive) {
            return res.status(401).json({
                message: 'User account is inactive or no longer exists'
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Not authorized, token failed'
        });
    }
};

const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.userId = decoded.id;
        req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
        // Invalid token; proceed as guest
    }

    next();
};

authMiddleware.protect = authMiddleware;
authMiddleware.authMiddleware = authMiddleware;
authMiddleware.optionalAuth = optionalAuth;

module.exports = authMiddleware;
module.exports.optionalAuth = optionalAuth;
