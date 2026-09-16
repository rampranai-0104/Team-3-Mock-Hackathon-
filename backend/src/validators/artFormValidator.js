const { body, param } = require('express-validator');
const { validateResult } = require('../middleware/validationMiddleware');

const allowedStatuses = ['active', 'inactive', 'draft'];

/**
 * Validation rules for creating an Art Form
 */
const validateCreateArtForm = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Art form name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('slug')
    .optional()
    .trim()
    .isSlug()
    .withMessage('Slug must be URL-safe (lowercase letters, numbers, and hyphens only)'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  body('regions')
    .optional()
    .isArray()
    .withMessage('Regions must be an array of strings'),
  body('regions.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Region entry cannot be empty'),
  body('techniques')
    .optional()
    .isArray()
    .withMessage('Techniques must be an array of strings'),
  body('materials')
    .optional()
    .isArray()
    .withMessage('Materials must be an array of strings'),
  body('history')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('History cannot exceed 10000 characters'),
  body('status')
    .optional()
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),
  validateResult
];

/**
 * Validation rules for updating an Art Form
 */
const validateUpdateArtForm = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Art Form ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  body('regions')
    .optional()
    .isArray()
    .withMessage('Regions must be an array of strings'),
  body('techniques')
    .optional()
    .isArray()
    .withMessage('Techniques must be an array of strings'),
  body('materials')
    .optional()
    .isArray()
    .withMessage('Materials must be an array of strings'),
  body('status')
    .optional()
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),
  validateResult
];

/**
 * Validation rules for Art Form ID parameter
 */
const validateArtFormId = [
  param('id')
    .custom((val) => {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(val);
      const isSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val);
      if (!isMongoId && !isSlug) {
        throw new Error('Art Form identifier must be a valid ObjectId or URL slug');
      }
      return true;
    }),
  validateResult
];

module.exports = {
  validateCreateArtForm,
  validateUpdateArtForm,
  validateArtFormId
};
