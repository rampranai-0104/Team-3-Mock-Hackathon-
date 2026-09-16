const express = require('express');
const router = express.Router();
const {
  getBookings,
  updateBooking
} = require('../../controllers/admin/bookingController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

/**
 * @route   GET /api/admin/bookings
 */
router.get('/', getBookings);

/**
 * @route   PATCH /api/admin/bookings/:id
 */
router.patch('/:id', updateBooking);

module.exports = router;
