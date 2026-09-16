const { body, param, query } = require('express-validator');
const { validateResult } = require('../middleware/validationMiddleware');
const { ARTIST_VERIFICATION_STATUS } = require('../constants');

const allowedStatuses = Object.values(ARTIST_VERIFICATION_STATUS || {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
});

/**
 * Validation rules for updating own artist profile
 */
const validateUpdateArtistProfile = [
  body('displayName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Display name must be between 2 and 100 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Bio cannot exceed 2000 characters'),
  body('artFormIds')
    .optional()
    .isArray()
    .withMessage('Art forms must be provided as an array of IDs'),
  body('artFormIds.*')
    .optional()
    .isMongoId()
    .withMessage('Each art form ID must be a valid ObjectId'),
  body('location.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City name cannot exceed 100 characters'),
  body('location.state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State name cannot exceed 100 characters'),
  body('languages')
    .optional()
    .isArray()
    .withMessage('Languages must be provided as an array of strings'),
  body('languages.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each language must be between 1 and 50 characters'),
  body('experience')
    .optional()
    .isInt({ min: 0, max: 80 })
    .withMessage('Experience must be a non-negative integer representing years'),
  body('availability.isAvailable')
    .optional()
    .isBoolean()
    .withMessage('availability.isAvailable must be a boolean'),
  body('availability.notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Availability notes cannot exceed 500 characters'),
  validateResult
];

/**
 * Validation rules for admin onboarding an artist
 */
const validateAdminOnboardArtist = [
  body('displayName')
    .trim()
    .notEmpty()
    .withMessage('Artist display name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Display name must be between 2 and 100 characters'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Must provide a valid email format'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Phone number must be between 8 and 20 characters'),
  body('artFormIds')
    .optional()
    .isArray()
    .withMessage('Art forms must be provided as an array of IDs'),
  body('artFormIds.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid art form ObjectId'),
  body('verificationStatus')
    .optional()
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),
  validateResult
];

/**
 * Validation rules for admin updating artist verification status
 */
const validateUpdateVerificationStatus = [
  param('id')
    .isMongoId()
    .withMessage('Invalid artist ID format'),
  body('status')
    .notEmpty()
    .withMessage('Verification status is required')
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),
  body('rejectionReason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Rejection reason cannot exceed 500 characters'),
  validateResult
];

/**
 * Validation rules for artist ID parameter
 */
const validateArtistId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid artist ID parameter format'),
  validateResult
];

module.exports = {
  validateUpdateArtistProfile,
  validateAdminOnboardArtist,
  validateUpdateVerificationStatus,
  validateArtistId
};
