const express = require('express');
const router = express.Router();
const {
  getRequests,
  getRequestById,
  updateRequestStatus
} = require('../../controllers/artist/requestController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ARTIST));

/**
 * @route   GET /api/artists/me/requests
 * @desc    Get all requests assigned to authenticated artist
 * @access  Private (Artist only)
 */
router.get('/', getRequests);

/**
 * @route   GET /api/artists/me/requests/:id
 * @desc    Get request details
 * @access  Private (Artist only)
 */
router.get('/:id', getRequestById);

/**
 * @route   PATCH /api/artists/me/requests/:id
 * @desc    Accept/reject/update request status
 * @access  Private (Artist only)
 */
router.patch('/:id', updateRequestStatus);

module.exports = router;
