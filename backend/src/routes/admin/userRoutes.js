const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../../controllers/admin/userController');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { ROLES } = require('../../constants');

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

/**
 * @route   GET /api/admin/users
 */
router.get('/', getUsers);

/**
 * @route   GET /api/admin/users/:id
 */
router.get('/:id', getUserById);

/**
 * @route   PATCH /api/admin/users/:id
 */
router.patch('/:id', updateUser);

/**
 * @route   DELETE /api/admin/users/:id
 */
router.delete('/:id', deleteUser);

module.exports = router;
