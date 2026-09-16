const { body } = require('express-validator');
const { validateResult } = require('../middleware/validationMiddleware');
const { ROLES } = require('../constants');

const allowedRoles = Object.values(ROLES || {
  PUBLIC: 'public',
  ARTIST: 'artist',
  INSTITUTION: 'institution',
  ADMIN: 'admin'
});

const validateSendOTP = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('purpose')
    .optional()
    .trim()
    .isIn(['verification', 'registration', 'login', 'password_reset', 'profile_update'])
    .withMessage('Invalid purpose specified'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  validateResult
];

const validateVerifyOTP = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP code is required')
    .isLength({ min: 4, max: 10 })
    .withMessage('OTP must be between 4 and 10 digits'),
  body('purpose')
    .optional()
    .trim()
    .isIn(['verification', 'registration', 'login', 'password_reset', 'profile_update'])
    .withMessage('Invalid purpose specified'),
  validateResult
];

const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(allowedRoles)
    .withMessage(`Role must be one of: ${allowedRoles.join(', ')}`),
  validateResult
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validateResult
];

module.exports = {
  validateSendOTP,
  validateVerifyOTP,
  validateRegister,
  validateLogin
};
