const express = require('express');
const router = express.Router();
const {
  getArtForms,
  createArtForm,
  updateArtForm,
  deleteArtForm
} = require('../../controllers/admin/artFormController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { singleUpload } = require('../../middleware/uploadMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

/**
 * @route   GET /api/admin/art-forms
 */
router.get('/', getArtForms);

/**
 * @route   POST /api/admin/art-forms
 */
router.post('/', singleUpload('image'), createArtForm);

/**
 * @route   PATCH /api/admin/art-forms/:id
 */
router.patch('/:id', singleUpload('image'), updateArtForm);

/**
 * @route   DELETE /api/admin/art-forms/:id
 */
router.delete('/:id', deleteArtForm);

module.exports = router;
