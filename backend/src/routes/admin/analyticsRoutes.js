const express = require('express');
const router = express.Router();
const {
  getOverview,
  getArtists,
  getArtForms,
  getEngagement,
  getRevenue
} = require('../../controllers/admin/analyticsController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

/**
 * @route   GET /api/admin/analytics/overview
 */
router.get('/overview', getOverview);

/**
 * @route   GET /api/admin/analytics/artists
 */
router.get('/artists', getArtists);

/**
 * @route   GET /api/admin/analytics/art-forms
 */
router.get('/art-forms', getArtForms);

/**
 * @route   GET /api/admin/analytics/engagement
 */
router.get('/engagement', getEngagement);

/**
 * @route   GET /api/admin/analytics/revenue
 */
router.get('/revenue', getRevenue);

module.exports = router;
