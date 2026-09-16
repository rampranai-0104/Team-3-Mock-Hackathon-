const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImportProducts
} = require('../../controllers/admin/productController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { handleCSVUpload } = require('../../middleware/uploadMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

/**
 * @route   GET /api/admin/products
 */
router.get('/', getProducts);

/**
 * @route   POST /api/admin/products/bulk-import
 */
router.post('/bulk-import', handleCSVUpload('file'), bulkImportProducts);

/**
 * @route   POST /api/admin/products
 */
router.post('/', createProduct);

/**
 * @route   PATCH /api/admin/products/:id
 */
router.patch('/:id', updateProduct);

/**
 * @route   DELETE /api/admin/products/:id
 */
router.delete('/:id', deleteProduct);

module.exports = router;
