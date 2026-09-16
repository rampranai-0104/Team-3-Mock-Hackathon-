const mongoose = require('mongoose');
const User = require('../../models/User');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { ROLES } = require('../../constants');

/**
 * GET /api/admin/users
 * List and filter all users with pagination
 */
const getUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.role && Object.values(ROLES).includes(req.query.role)) {
      query.role = req.query.role;
    }

    if (req.query.status && ['active', 'inactive', 'suspended'].includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return sendSuccess(res, 'Users retrieved successfully', {
      totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit) || 1,
      users
    });
  } catch (error) {
    console.error('Error in getUsers:', error);
    return sendError(res, 'Failed to retrieve users', error.message, 500);
  }
};

/**
 * GET /api/admin/users/:id
 * Retrieve details for one user
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid user ID format.', null, 400);
    }

    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      return sendError(res, 'User not found.', null, 404);
    }

    return sendSuccess(res, 'User retrieved successfully', user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    return sendError(res, 'Failed to retrieve user', error.message, 500);
  }
};

/**
 * PATCH /api/admin/users/:id
 * Update user permitted status, role, or profile fields
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid user ID format.', null, 400);
    }

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found.', null, 404);
    }

    const { name, phone, role, status, preferredLanguage, emailVerified } = req.body;
    const validationErrors = [];

    // Prevent admin from demoting or disabling their own account
    const isSelf = req.user._id.toString() === id;
    if (isSelf) {
      if (role && role !== ROLES.ADMIN) {
        validationErrors.push({ field: 'role', message: 'You cannot change your own admin role.' });
      }
      if (status && status !== 'active') {
        validationErrors.push({ field: 'status', message: 'You cannot suspend or deactivate your own account.' });
      }
    }

    if (role && !Object.values(ROLES).includes(role)) {
      validationErrors.push({ field: 'role', message: `Invalid role. Allowed roles: ${Object.values(ROLES).join(', ')}` });
    }

    if (status && !['active', 'inactive', 'suspended'].includes(status)) {
      validationErrors.push({ field: 'status', message: 'Invalid status. Allowed: active, inactive, suspended.' });
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone ? phone.trim() : '';
    if (role) user.role = role;
    if (status) user.status = status;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage.trim();
    if (emailVerified !== undefined) user.emailVerified = Boolean(emailVerified);

    await user.save();

    const updatedUser = await User.findById(user._id).select('-passwordHash');
    return sendSuccess(res, 'User updated successfully', updatedUser);
  } catch (error) {
    console.error('Error in updateUser:', error);
    return sendError(res, 'Failed to update user', error.message, 500);
  }
};

/**
 * DELETE /api/admin/users/:id
 * Deactivates user to maintain relational database integrity
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid user ID format.', null, 400);
    }

    if (req.user._id.toString() === id) {
      return sendError(res, 'You cannot delete or deactivate your own active admin account.', null, 400);
    }

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found.', null, 404);
    }

    // Deactivate/suspend user rather than hard deletion to preserve past bookings/orders
    user.status = 'inactive';
    await user.save();

    return sendSuccess(res, 'User deactivated successfully', { id: user._id, status: 'inactive' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return sendError(res, 'Failed to deactivate user', error.message, 500);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
