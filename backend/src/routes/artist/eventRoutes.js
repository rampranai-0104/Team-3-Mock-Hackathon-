const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent
} = require('../../controllers/artist/eventController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ARTIST));

/**
 * @route   GET /api/artists/me/events
 * @desc    Get all events for authenticated artist
 * @access  Private (Artist only)
 */
router.get('/', getEvents);

/**
 * @route   POST /api/artists/me/events
 * @desc    Create/propose a new event
 * @access  Private (Artist only)
 */
router.post('/', createEvent);

/**
 * @route   PATCH /api/artists/me/events/:id
 * @desc    Update an event owned by the artist
 * @access  Private (Artist only)
 */
router.patch('/:id', updateEvent);

module.exports = router;
