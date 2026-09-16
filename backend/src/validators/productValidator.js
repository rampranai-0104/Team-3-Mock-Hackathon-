const { body, param, query } = require('express-validator');
const { validateResult } = require('../middleware/validationMiddleware');
const { PRODUCT_STATUS, PRODUCT_MODERATION_STATUS } = require('../constants');

const allowedStatuses = Object.values(PRODUCT_STATUS || {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  ARCHIVED: 'archived'
});

const allowedModerationStatuses = Object.values(PRODUCT_MODERATION_STATUS || {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ARCHIVED: 'archived'
});

/**
 * Validation rules for creating a Product
 */
const validateCreateProduct = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Title must be between 2 and 150 characters'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be between 2 and 150 characters'),
  body().custom((value) => {
    if (!value.title && !value.name) {
      throw new Error('Product title or name is required');
    }
    return true;
  }),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('artFormId')
    .notEmpty()
    .withMessage('artFormId is required')
    .isMongoId()
    .withMessage('Invalid Art Form ObjectId'),
  body('artistId')
    .optional()
    .isMongoId()
    .withMessage('Invalid Artist ObjectId'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 3000 })
    .withMessage('Description cannot exceed 3000 characters'),
  body('status')
    .optional()
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),
  body('moderationStatus')
    .optional()
    .isIn(allowedModerationStatuses)
    .withMessage(`Moderation status must be one of: ${allowedModerationStatuses.join(', ')}`),
  validateResult
];

/**
 * Validation rules for updating a Product
 */
const validateUpdateProduct = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Product ID format'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Title must be between 2 and 150 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('artFormId')
    .optional()
    .isMongoId()
    .withMessage('Invalid Art Form ObjectId'),
  body('status')
    .optional()
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),
  body('moderationStatus')
    .optional()
    .isIn(allowedModerationStatuses)
    .withMessage(`Moderation status must be one of: ${allowedModerationStatuses.join(', ')}`),
  validateResult
];

/**
 * Validation rules for Admin Product Moderation
 */
const validateModerateProduct = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Product ID format'),
  body('moderationStatus')
    .optional()
    .isIn(allowedModerationStatuses)
    .withMessage(`Moderation status must be one of: ${allowedModerationStatuses.join(', ')}`),
  body('status')
    .optional()
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),
  validateResult
];

/**
 * Validation rules for Product ID parameter
 */
const validateProductId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Product ID parameter format'),
  validateResult
];

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
  validateModerateProduct,
  validateProductId
};
