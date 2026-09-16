const express = require('express');
const router = express.Router();
const {
  getRequests,
  updateRequest
} = require('../../controllers/admin/requestController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

/**
 * @route   GET /api/admin/requests
 */
router.get('/', getRequests);

/**
 * @route   PATCH /api/admin/requests/:id
 */
router.patch('/:id', updateRequest);

module.exports = router;
