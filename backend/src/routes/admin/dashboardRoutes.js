const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../../controllers/admin/dashboardController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard metrics & KPIs
 * @access  Private (Admin only)
 */
router.get('/', getDashboardData);

module.exports = router;
