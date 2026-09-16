const express = require('express');
const router = express.Router();
const {
  getKnowledgeItems,
  createKnowledgeItem,
  updateKnowledgeItem,
  deleteKnowledgeItem,
  uploadKnowledgeMedia
} = require('../../controllers/admin/knowledgeController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { handleUpload } = require('../../middleware/uploadMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

/**
 * @route   GET /api/admin/knowledge
 */
router.get('/', getKnowledgeItems);

/**
 * @route   POST /api/admin/knowledge
 */
router.post('/', createKnowledgeItem);

/**
 * @route   PATCH /api/admin/knowledge/:id
 */
router.patch('/:id', updateKnowledgeItem);

/**
 * @route   DELETE /api/admin/knowledge/:id
 */
router.delete('/:id', deleteKnowledgeItem);

/**
 * @route   POST /api/admin/knowledge/:id/media
 */
router.post('/:id/media', handleUpload('media'), uploadKnowledgeMedia);

module.exports = router;
