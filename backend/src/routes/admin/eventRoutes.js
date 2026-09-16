const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../../controllers/admin/eventController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

/**
 * @route   GET /api/admin/events
 */
router.get('/', getEvents);

/**
 * @route   POST /api/admin/events
 */
router.post('/', createEvent);

/**
 * @route   PATCH /api/admin/events/:id
 */
router.patch('/:id', updateEvent);

/**
 * @route   DELETE /api/admin/events/:id
 */
router.delete('/:id', deleteEvent);

module.exports = router;
