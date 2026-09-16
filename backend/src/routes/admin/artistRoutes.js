const express = require('express');
const router = express.Router();
const {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
  approveArtist,
  rejectArtist
} = require('../../controllers/admin/artistController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

/**
 * @route   GET /api/admin/artists
 */
router.get('/', getArtists);

/**
 * @route   GET /api/admin/artists/:id
 */
router.get('/:id', getArtistById);

/**
 * @route   POST /api/admin/artists
 */
router.post('/', createArtist);

/**
 * @route   PATCH /api/admin/artists/:id
 */
router.patch('/:id', updateArtist);

/**
 * @route   POST /api/admin/artists/:id/approve
 */
router.post('/:id/approve', approveArtist);

/**
 * @route   POST /api/admin/artists/:id/reject
 */
router.post('/:id/reject', rejectArtist);

module.exports = router;
