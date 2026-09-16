const { body, param, query } = require('express-validator');
const { validateResult } = require('../middleware/validationMiddleware');
const { EVENT_STATUS, EVENT_TYPES } = require('../constants');

const allowedEventTypes = Object.values(EVENT_TYPES || {
  WORKSHOP: 'workshop',
  PERFORMANCE: 'performance',
  MASTERCLASS: 'masterclass',
  EXHIBITION: 'exhibition',
  TALK: 'talk',
  LEARNING: 'learning'
});

const allowedStatuses = Object.values(EVENT_STATUS || {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  PUBLISHED: 'published',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
});

/**
 * Validation rules for creating an Event
 */
const validateCreateEvent = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),
  body('type')
    .optional()
    .isIn(allowedEventTypes)
    .withMessage(`Event type must be one of: ${allowedEventTypes.join(', ')}`),
  body('artFormIds')
    .optional()
    .isArray()
    .withMessage('artFormIds must be an array of ObjectIds'),
  body('artFormIds.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid Art Form ObjectId'),
  body('artistIds')
    .optional()
    .isArray()
    .withMessage('artistIds must be an array of ObjectIds'),
  body('artistIds.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid Artist ObjectId'),
  body('date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Date must be a valid ISO8601 date'),
  body('dateTime')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('dateTime must be a valid ISO8601 timestamp'),
  body('durationMinutes')
    .optional()
    .isInt({ min: 10, max: 1440 })
    .withMessage('Duration must be between 10 and 1440 minutes'),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Capacity must be at least 1 attendee'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('location.isOnline')
    .optional()
    .isBoolean()
    .withMessage('location.isOnline must be a boolean'),
  body('location.meetingLink')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),
  validateResult
];

/**
 * Validation rules for updating an Event
 */
const validateUpdateEvent = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Event ID format'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),
  body('type')
    .optional()
    .isIn(allowedEventTypes)
    .withMessage(`Event type must be one of: ${allowedEventTypes.join(', ')}`),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Capacity must be at least 1'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('status')
    .optional()
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),
  validateResult
];

/**
 * Validation rules for Event ID parameter
 */
const validateEventId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Event ID parameter format'),
  validateResult
];

module.exports = {
  validateCreateEvent,
  validateUpdateEvent,
  validateEventId
};
