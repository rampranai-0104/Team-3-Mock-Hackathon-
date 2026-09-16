const mongoose = require('mongoose');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const Artist = require('../../models/Artist');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { createNotification } = require('../../services/notificationService');
const { PRODUCT_STATUS, PRODUCT_MODERATION_STATUS } = require('../../constants');

/**
 * GET /api/admin/products
 * List all products across the platform with filtering and pagination
 */
const getProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status && Object.values(PRODUCT_STATUS).includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.moderationStatus && Object.values(PRODUCT_MODERATION_STATUS).includes(req.query.moderationStatus)) {
      query.moderationStatus = req.query.moderationStatus;
    }

    if (req.query.artistId && mongoose.Types.ObjectId.isValid(req.query.artistId)) {
      query.artistId = req.query.artistId;
    }

    if (req.query.artFormId && mongoose.Types.ObjectId.isValid(req.query.artFormId)) {
      query.artFormId = req.query.artFormId;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('artistId', 'displayName location')
      .populate('artFormId', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return sendSuccess(res, 'Products retrieved successfully', {
      totalProducts,
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit) || 1,
      products
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    return sendError(res, 'Failed to retrieve products', error.message, 500);
  }
};

/**
 * PATCH /api/admin/products/:id
 * Moderate and update product status or fields
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid product ID format.', null, 400);
    }

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found.', null, 404);
    }

    const {
      title,
      description,
      price,
      stock,
      status,
      moderationStatus
    } = req.body;

    const validationErrors = [];

    if (moderationStatus && !Object.values(PRODUCT_MODERATION_STATUS).includes(moderationStatus)) {
      validationErrors.push({
        field: 'moderationStatus',
        message: `Invalid moderation status. Allowed: ${Object.values(PRODUCT_MODERATION_STATUS).join(', ')}`
      });
    }

    if (status && !Object.values(PRODUCT_STATUS).includes(status)) {
      validationErrors.push({
        field: 'status',
        message: `Invalid status. Allowed: ${Object.values(PRODUCT_STATUS).join(', ')}`
      });
    }

    if (price !== undefined) {
      const priceNum = Number(price);
      if (isNaN(priceNum) || priceNum < 0) {
        validationErrors.push({ field: 'price', message: 'Price must be a non-negative number.' });
      }
    }

    if (stock !== undefined) {
      const stockNum = Number(stock);
      if (isNaN(stockNum) || stockNum < 0) {
        validationErrors.push({ field: 'stock', message: 'Stock must be a non-negative number.' });
      }
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    if (title) product.title = title.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);

    const oldModStatus = product.moderationStatus;
    if (moderationStatus) product.moderationStatus = moderationStatus;
    if (status) product.status = status;

    // Automatically set status to active if approved and currently draft
    if (moderationStatus === PRODUCT_MODERATION_STATUS.APPROVED && product.status === PRODUCT_STATUS.DRAFT) {
      product.status = PRODUCT_STATUS.ACTIVE;
    }

    await product.save();

    // Notify artist of moderation decision
    if (moderationStatus && oldModStatus !== moderationStatus) {
      const artist = await Artist.findById(product.artistId);
      if (artist) {
        await createNotification({
          userId: artist.userId,
          type: 'product_moderation_update',
          title: `Product Moderation: ${moderationStatus.toUpperCase()}`,
          message: `Your product "${product.title}" has been marked as ${moderationStatus} by administration.`,
          entityId: product._id,
          entityType: 'Product'
        });
      }
    }

    const updatedProduct = await Product.findById(product._id)
      .populate('artistId', 'displayName location')
      .populate('artFormId', 'name slug');

    return sendSuccess(res, 'Product updated successfully', updatedProduct);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return sendError(res, 'Failed to update product', error.message, 500);
  }
};

/**
 * DELETE /api/admin/products/:id
 * Removes or archives a product (checks historical orders to protect references)
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid product ID format.', null, 400);
    }

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found.', null, 404);
    }

    // Check if product is referenced in any historical orders
    const orderCount = await Order.countDocuments({ 'items.productId': id });

    if (orderCount > 0 || product.moderationStatus === PRODUCT_MODERATION_STATUS.APPROVED) {
      // Archive to preserve historical order snapshots and financial records
      product.status = PRODUCT_STATUS.ARCHIVED;
      product.moderationStatus = PRODUCT_MODERATION_STATUS.ARCHIVED;
      await product.save();

      return sendSuccess(res, `Product is associated with historical data (${orderCount} orders) and was archived.`, {
        id: product._id,
        status: PRODUCT_STATUS.ARCHIVED,
        moderationStatus: PRODUCT_MODERATION_STATUS.ARCHIVED,
        orderReferences: orderCount
      });
    }

    // Unreferenced draft product can be hard deleted
    await Product.findByIdAndDelete(id);
    return sendSuccess(res, 'Product deleted successfully', { id });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return sendError(res, 'Failed to delete product', error.message, 500);
  }
};

module.exports = {
  getProducts,
  updateProduct,
  deleteProduct
};
