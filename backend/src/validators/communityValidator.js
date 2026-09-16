const { body } = require('express-validator');
const { validateResult } = require('../middleware/validationMiddleware');

const validateCreatePost = [
    body('caption')
        .trim()
        .notEmpty().withMessage('Caption is required')
        .isLength({ max: 2000 }).withMessage('Caption cannot exceed 2000 characters'),
    body('event')
        .optional({ checkFalsy: true })
        .isMongoId().withMessage('Invalid event ID format'),
    body('artForm')
        .optional({ checkFalsy: true })
        .isMongoId().withMessage('Invalid art form ID format'),
    validateResult
];

const validateUpdatePost = [
    body('caption')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Caption cannot exceed 2000 characters'),
    body('event')
        .optional({ checkFalsy: true })
        .isMongoId().withMessage('Invalid event ID format'),
    body('artForm')
        .optional({ checkFalsy: true })
        .isMongoId().withMessage('Invalid art form ID format'),
    validateResult
];

const validateComment = [
    body('text')
        .trim()
        .notEmpty().withMessage('Comment text is required')
        .isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
    validateResult
];

module.exports = {
    validateCreatePost,
    validateUpdatePost,
    validateComment
};
