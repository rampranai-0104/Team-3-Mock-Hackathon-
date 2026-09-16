const express = require('express');
const router = express.Router();
const {
  getProducts,
  updateProduct,
  deleteProduct
} = require('../../controllers/admin/productController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

/**
 * @route   GET /api/admin/products
 */
router.get('/', getProducts);

/**
 * @route   PATCH /api/admin/products/:id
 */
router.patch('/:id', updateProduct);

/**
 * @route   DELETE /api/admin/products/:id
 */
router.delete('/:id', deleteProduct);

module.exports = router;
