const mongoose = require('mongoose');
const Product = require('../../models/Product');
const Artist = require('../../models/Artist');
const ArtForm = require('../../models/ArtForm');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { uploadToCloudinary } = require('../../services/cloudinaryService');
const { PRODUCT_STATUS, PRODUCT_MODERATION_STATUS, MEDIA_TYPES } = require('../../constants');

/**
 * GET /api/artists/me/products
 * List all products created by the authenticated artist
 */
const getProducts = async (req, res) => {
  try {
    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const query = { artistId: artist._id };

    if (req.query.status && Object.values(PRODUCT_STATUS).includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.moderationStatus && Object.values(PRODUCT_MODERATION_STATUS).includes(req.query.moderationStatus)) {
      query.moderationStatus = req.query.moderationStatus;
    }

    const products = await Product.find(query)
      .populate('artFormId', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, 'Artist products retrieved successfully', products);
  } catch (error) {
    console.error('Error in getProducts:', error);
    return sendError(res, 'Failed to retrieve products', error.message, 500);
  }
};

/**
 * POST /api/artists/me/products
 * Create a new product for the authenticated artist
 */
const createProduct = async (req, res) => {
  try {
    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const {
      title,
      description,
      price,
      stock,
      artFormId,
      status,
      moderationStatus
    } = req.body;

    const validationErrors = [];

    if (!title || typeof title !== 'string' || !title.trim()) {
      validationErrors.push({ field: 'title', message: 'Product title is required.' });
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      validationErrors.push({ field: 'price', message: 'Price must be a non-negative number.' });
    }

    const stockNum = stock !== undefined ? Number(stock) : 1;
    if (isNaN(stockNum) || stockNum < 0) {
      validationErrors.push({ field: 'stock', message: 'Stock must be a non-negative number.' });
    }

    let finalArtFormId = artFormId;
    if (!finalArtFormId || !mongoose.Types.ObjectId.isValid(finalArtFormId)) {
      const defaultForm = await ArtForm.findOne();
      if (defaultForm) {
        finalArtFormId = defaultForm._id;
      } else {
        validationErrors.push({ field: 'artFormId', message: 'Valid artFormId is required.' });
      }
    } else {
      const artFormExists = await ArtForm.findById(finalArtFormId);
      if (!artFormExists) {
        const defaultForm = await ArtForm.findOne();
        if (defaultForm) {
          finalArtFormId = defaultForm._id;
        } else {
          validationErrors.push({ field: 'artFormId', message: 'Referenced art form does not exist.' });
        }
      }
    }

    // Direct self-approval is forbidden
    if (moderationStatus === PRODUCT_MODERATION_STATUS.APPROVED) {
      validationErrors.push({
        field: 'moderationStatus',
        message: 'Direct product approval is restricted to administrators.'
      });
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    const initialModStatus = moderationStatus === PRODUCT_MODERATION_STATUS.PENDING_REVIEW
      ? PRODUCT_MODERATION_STATUS.PENDING_REVIEW
      : PRODUCT_MODERATION_STATUS.DRAFT;

    const initialStatus = status && Object.values(PRODUCT_STATUS).includes(status)
      ? status
      : PRODUCT_STATUS.ACTIVE || 'active';

    let productImages = [];
    if (req.body.images && Array.isArray(req.body.images)) {
      productImages = req.body.images.map(img => typeof img === 'string' ? { url: img, isPrimary: true } : img);
    } else if (req.body.image) {
      productImages = [{ url: req.body.image, isPrimary: true }];
    }

    const product = await Product.create({
      artistId: artist._id,
      artFormId: finalArtFormId,
      title: title.trim(),
      name: title.trim(),
      description: description ? description.trim() : '',
      price: priceNum,
      stock: stockNum,
      category: req.body.category || 'painting',
      images: productImages,
      media: productImages.map(img => ({ url: img.url, isPrimary: true, type: 'image' })),
      status: initialStatus,
      moderationStatus: initialModStatus,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('artFormId', 'name slug');

    return sendSuccess(res, 'Product created successfully', populatedProduct, 201);
  } catch (error) {
    console.error('Error in createProduct:', error);
    return sendError(res, 'Failed to create product', error.message, 500);
  }
};

/**
 * GET /api/artists/me/products/:id
 * Get details of one product owned by the authenticated artist
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid product ID format.', null, 400);
    }

    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const product = await Product.findOne({ _id: id, artistId: artist._id })
      .populate('artFormId', 'name slug description');

    if (!product) {
      return sendError(res, 'Product not found or not owned by you.', null, 404);
    }

    return sendSuccess(res, 'Product retrieved successfully', product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    return sendError(res, 'Failed to retrieve product', error.message, 500);
  }
};

/**
 * PATCH /api/artists/me/products/:id
 * Update a product owned by the authenticated artist
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid product ID format.', null, 400);
    }

    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const product = await Product.findOne({ _id: id, artistId: artist._id });
    if (!product) {
      return sendError(res, 'Product not found or not owned by you.', null, 404);
    }

    const {
      title,
      description,
      price,
      stock,
      artFormId,
      status,
      moderationStatus,
      artistId
    } = req.body;

    const validationErrors = [];

    if (artistId && artistId.toString() !== artist._id.toString()) {
      validationErrors.push({ field: 'artistId', message: 'Altering product ownership is forbidden.' });
    }

    if (moderationStatus === PRODUCT_MODERATION_STATUS.APPROVED && product.moderationStatus !== PRODUCT_MODERATION_STATUS.APPROVED) {
      validationErrors.push({
        field: 'moderationStatus',
        message: 'Direct product self-approval is restricted to administrators.'
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

    if (artFormId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(artFormId)) {
        validationErrors.push({ field: 'artFormId', message: 'Invalid artFormId.' });
      } else {
        const formExists = await ArtForm.findById(artFormId);
        if (!formExists) {
          validationErrors.push({ field: 'artFormId', message: 'Referenced art form does not exist.' });
        }
      }
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    if (title) {
      product.title = title.trim();
      product.name = title.trim();
    }
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (artFormId) product.artFormId = artFormId;
    if (req.body.category) product.category = req.body.category;
    if (status && Object.values(PRODUCT_STATUS).includes(status)) product.status = status;
    if (req.body.image) {
      product.images = [{ url: req.body.image, isPrimary: true }];
      product.media = [{ url: req.body.image, isPrimary: true, type: 'image' }];
    }

    if (moderationStatus && moderationStatus !== PRODUCT_MODERATION_STATUS.APPROVED) {
      product.moderationStatus = moderationStatus;
    }

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('artFormId', 'name slug');

    return sendSuccess(res, 'Product updated successfully', updatedProduct);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return sendError(res, 'Failed to update product', error.message, 500);
  }
};

/**
 * DELETE /api/artists/me/products/:id
 * Archive or delete an artist's product
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid product ID format.', null, 400);
    }

    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const product = await Product.findOne({ _id: id, artistId: artist._id });
    if (!product) {
      return sendError(res, 'Product not found or not owned by you.', null, 404);
    }

    // If product was already reviewed or approved, archive it to preserve order integrity
    if (product.moderationStatus === PRODUCT_MODERATION_STATUS.APPROVED) {
      product.status = PRODUCT_STATUS.ARCHIVED;
      product.moderationStatus = PRODUCT_MODERATION_STATUS.ARCHIVED;
      await product.save();
      return sendSuccess(res, 'Product archived successfully', { id, status: 'archived' });
    }

    // If it's a draft, hard delete is safe
    await Product.findByIdAndDelete(id);
    return sendSuccess(res, 'Product deleted successfully', { id });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return sendError(res, 'Failed to delete product', error.message, 500);
  }
};

/**
 * POST /api/artists/me/products/:id/media
 * Upload media image for an artist's product
 */
const uploadProductMedia = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid product ID format.', null, 400);
    }

    if (!req.file) {
      return sendError(res, 'No media file provided for upload.', null, 400);
    }

    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const product = await Product.findOne({ _id: id, artistId: artist._id });
    if (!product) {
      return sendError(res, 'Product not found or not owned by you.', null, 404);
    }

    const isVideo = req.file.mimetype.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: `tvarita/products/${product._id}`,
      resource_type: resourceType
    });

    const isPrimary = product.media.length === 0 || Boolean(req.body.isPrimary);

    const mediaItem = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      type: isVideo ? MEDIA_TYPES.VIDEO : MEDIA_TYPES.IMAGE,
      isPrimary
    };

    product.media.push(mediaItem);
    await product.save();

    const savedMedia = product.media[product.media.length - 1];

    return sendSuccess(res, 'Product media uploaded successfully', savedMedia, 201);
  } catch (error) {
    console.error('Error in uploadProductMedia:', error);
    return sendError(res, 'Failed to upload product media', error.message, 500);
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductMedia
};
