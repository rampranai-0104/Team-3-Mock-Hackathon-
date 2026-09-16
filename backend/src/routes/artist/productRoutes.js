const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductMedia
} = require('../../controllers/artist/productController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { handleUpload } = require('../../middleware/uploadMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ARTIST));

/**
 * @route   GET /api/artists/me/products
 * @desc    List all products of the authenticated artist
 * @access  Private (Artist only)
 */
router.get('/', getProducts);

/**
 * @route   POST /api/artists/me/products
 * @desc    Add a product
 * @access  Private (Artist only)
 */
router.post('/', createProduct);

/**
 * @route   GET /api/artists/me/products/:id
 * @desc    Get details of an artist product
 * @access  Private (Artist only)
 */
router.get('/:id', getProductById);

/**
 * @route   PATCH /api/artists/me/products/:id
 * @desc    Edit an artist product
 * @access  Private (Artist only)
 */
router.patch('/:id', updateProduct);

/**
 * @route   DELETE /api/artists/me/products/:id
 * @desc    Archive/delete an artist product
 * @access  Private (Artist only)
 */
router.delete('/:id', deleteProduct);

/**
 * @route   POST /api/artists/me/products/:id/media
 * @desc    Upload product media
 * @access  Private (Artist only)
 */
router.post('/:id/media', handleUpload('media'), uploadProductMedia);

module.exports = router;
