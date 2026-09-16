const express = require('express');
const router = express.Router();
const { getEarnings } = require('../../controllers/artist/earningsController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ARTIST));

/**
 * @route   GET /api/artists/me/earnings
 * @desc    Get earnings summary and financial breakdown for authenticated artist
 * @access  Private (Artist only)
 */
router.get('/', getEarnings);

module.exports = router;
