const express = require('express');
const router = express.Router();
const {
  getOwnProfile,
  updateOwnProfile,
  uploadMedia,
  deleteMedia
} = require('../../controllers/artist/profileController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { handleUpload } = require('../../middleware/uploadMiddleware');
const { ROLES } = require('../../constants');

// All artist profile routes require authentication and the 'artist' role
router.use(protect);
router.use(authorizeRoles(ROLES.ARTIST));

/**
 * @route   GET /api/artists/me
 * @desc    Get current authenticated artist's profile
 * @access  Private (Artist only)
 */
router.get('/me', getOwnProfile);

/**
 * @route   PATCH /api/artists/me
 * @desc    Update current authenticated artist's profile
 * @access  Private (Artist only)
 */
router.patch('/me', updateOwnProfile);

/**
 * @route   POST /api/artists/me/media
 * @desc    Upload media to artist profile
 * @access  Private (Artist only)
 */
router.post('/me/media', handleUpload('media'), uploadMedia);

/**
 * @route   DELETE /api/artists/me/media/:mediaId
 * @desc    Delete media from artist profile
 * @access  Private (Artist only)
 */
router.delete('/me/media/:mediaId', deleteMedia);

module.exports = router;
