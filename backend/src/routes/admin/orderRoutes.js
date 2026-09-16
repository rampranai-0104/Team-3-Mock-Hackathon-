const express = require('express');
const router = express.Router();
const {
  getOrders,
  updateOrder
} = require('../../controllers/admin/orderController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

/**
 * @route   GET /api/admin/orders
 */
router.get('/', getOrders);

/**
 * @route   PATCH /api/admin/orders/:id
 */
router.patch('/:id', updateOrder);

module.exports = router;
