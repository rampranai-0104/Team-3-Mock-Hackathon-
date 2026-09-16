const express = require('express');
const router = express.Router();
const { getFollowers } = require('../../controllers/artist/followerController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ARTIST));

/**
 * @route   GET /api/artists/me/followers
 * @desc    Get followers count and list for authenticated artist
 * @access  Private (Artist only)
 */
router.get('/', getFollowers);

module.exports = router;
