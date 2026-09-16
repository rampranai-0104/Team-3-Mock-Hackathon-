const mongoose = require('mongoose');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const Artist = require('../../models/Artist');
const ArtForm = require('../../models/ArtForm');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { createNotification } = require('../../services/notificationService');
const { PRODUCT_STATUS, PRODUCT_MODERATION_STATUS } = require('../../constants');
const { parseCSV } = require('../../utils/csvParser');

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
 * POST /api/admin/products
 * Admin creates a product on behalf of an artist (with or without User account)
 */
const createProduct = async (req, res) => {
  try {
    const {
      artistId,
      artFormId,
      title,
      description,
      price,
      stock,
      status,
      moderationStatus
    } = req.body;

    const validationErrors = [];

    if (!artistId || !mongoose.Types.ObjectId.isValid(artistId)) {
      validationErrors.push({ field: 'artistId', message: 'Valid artistId is required.' });
    } else {
      const artist = await Artist.findById(artistId);
      if (!artist) {
        validationErrors.push({ field: 'artistId', message: 'Referenced artist does not exist.' });
      }
    }

    if (!artFormId || !mongoose.Types.ObjectId.isValid(artFormId)) {
      validationErrors.push({ field: 'artFormId', message: 'Valid artFormId is required.' });
    } else {
      const artForm = await ArtForm.findById(artFormId);
      if (!artForm) {
        validationErrors.push({ field: 'artFormId', message: 'Referenced artForm does not exist.' });
      }
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
      validationErrors.push({ field: 'title', message: 'Product title is required.' });
    }

    if (price === undefined) {
      validationErrors.push({ field: 'price', message: 'Price is required.' });
    } else {
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

    if (status && !Object.values(PRODUCT_STATUS).includes(status)) {
      validationErrors.push({ field: 'status', message: `Invalid status. Allowed: ${Object.values(PRODUCT_STATUS).join(', ')}` });
    }

    if (moderationStatus && !Object.values(PRODUCT_MODERATION_STATUS).includes(moderationStatus)) {
      validationErrors.push({ field: 'moderationStatus', message: `Invalid moderationStatus. Allowed: ${Object.values(PRODUCT_MODERATION_STATUS).join(', ')}` });
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    const initialModeration = moderationStatus || PRODUCT_MODERATION_STATUS.APPROVED;
    const initialStatus = status || (initialModeration === PRODUCT_MODERATION_STATUS.APPROVED ? PRODUCT_STATUS.ACTIVE : PRODUCT_STATUS.DRAFT);

    const product = await Product.create({
      artistId,
      artFormId,
      title: title.trim(),
      description: description ? description.trim() : '',
      price: Number(price),
      stock: stock !== undefined ? Number(stock) : 1,
      status: initialStatus,
      moderationStatus: initialModeration
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('artistId', 'displayName location')
      .populate('artFormId', 'name slug');

    return sendSuccess(res, 'Product created successfully by admin', populatedProduct, 201);
  } catch (error) {
    console.error('Error in createProduct:', error);
    return sendError(res, 'Failed to create product', error.message, 500);
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

    // Notify artist of moderation decision if artist has an account
    if (moderationStatus && oldModStatus !== moderationStatus) {
      const artist = await Artist.findById(product.artistId);
      if (artist && artist.userId) {
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

/**
 * POST /api/admin/products/bulk-import
 * Batch import products for existing artists from CSV
 */
const bulkImportProducts = async (req, res) => {
  try {
    let csvContent = '';

    if (req.file && req.file.buffer) {
      csvContent = req.file.buffer.toString('utf-8');
    } else if (req.body && req.body.csvData) {
      csvContent = req.body.csvData;
    } else if (typeof req.body === 'string' && req.body.trim().startsWith('artistId')) {
      csvContent = req.body;
    }

    if (!csvContent || !csvContent.trim()) {
      return sendError(res, 'No CSV file or CSV content provided for import.', null, 400);
    }

    const rows = parseCSV(csvContent);
    if (rows.length === 0) {
      return sendError(res, 'CSV content is empty or contains only headers.', null, 400);
    }

    const summary = {
      totalRows: rows.length,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: []
    };

    for (const row of rows) {
      const rowNum = row._rowNumber || 'Unknown';
      const artistId = row.artistId ? row.artistId.trim() : '';
      const artFormId = row.artFormId ? row.artFormId.trim() : '';
      const title = row.title ? row.title.trim() : '';
      const priceNum = Number(row.price);
      const stockNum = row.stock !== undefined && row.stock !== '' ? Number(row.stock) : 1;

      if (!artistId || !mongoose.Types.ObjectId.isValid(artistId)) {
        summary.failed++;
        summary.errors.push({ row: rowNum, field: 'artistId', message: 'Valid artistId ObjectId is required' });
        continue;
      }

      const artistExists = await Artist.findById(artistId);
      if (!artistExists) {
        summary.failed++;
        summary.errors.push({ row: rowNum, field: 'artistId', message: `Artist ${artistId} does not exist` });
        continue;
      }

      let targetArtFormId = artFormId;
      if (!targetArtFormId || !mongoose.Types.ObjectId.isValid(targetArtFormId)) {
        // Fallback to artist's primary artFormId if available
        if (artistExists.artFormIds && artistExists.artFormIds.length > 0) {
          targetArtFormId = artistExists.artFormIds[0];
        } else {
          summary.failed++;
          summary.errors.push({ row: rowNum, field: 'artFormId', message: 'Valid artFormId is required or artist must have art forms assigned' });
          continue;
        }
      }

      if (!title) {
        summary.failed++;
        summary.errors.push({ row: rowNum, field: 'title', message: 'Missing product title' });
        continue;
      }

      if (isNaN(priceNum) || priceNum < 0) {
        summary.failed++;
        summary.errors.push({ row: rowNum, field: 'price', message: 'Price must be a non-negative number' });
        continue;
      }

      const status = row.status && Object.values(PRODUCT_STATUS).includes(row.status.toLowerCase().trim())
        ? row.status.toLowerCase().trim()
        : PRODUCT_STATUS.ACTIVE;

      const moderationStatus = row.moderationStatus && Object.values(PRODUCT_MODERATION_STATUS).includes(row.moderationStatus.toLowerCase().trim())
        ? row.moderationStatus.toLowerCase().trim()
        : PRODUCT_MODERATION_STATUS.APPROVED;

      await Product.create({
        artistId,
        artFormId: targetArtFormId,
        title,
        description: row.description ? row.description.trim() : '',
        price: priceNum,
        stock: isNaN(stockNum) || stockNum < 0 ? 1 : stockNum,
        status,
        moderationStatus
      });

      summary.created++;
    }

    return sendSuccess(res, 'Bulk product import completed', summary);
  } catch (error) {
    console.error('Error in bulkImportProducts:', error);
    return sendError(res, 'Failed to perform bulk product import', error.message, 500);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImportProducts
};
