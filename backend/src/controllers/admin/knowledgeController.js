const mongoose = require('mongoose');
const KnowledgeItem = require('../../models/KnowledgeItem');
const ArtForm = require('../../models/ArtForm');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { uploadToCloudinary } = require('../../services/cloudinaryService');
const { KNOWLEDGE_STATUS, KNOWLEDGE_TYPES, MEDIA_TYPES } = require('../../constants');

/**
 * GET /api/admin/knowledge
 * List cultural knowledge archive entries with filtering and pagination
 */
const getKnowledgeItems = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status && Object.values(KNOWLEDGE_STATUS).includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.type && Object.values(KNOWLEDGE_TYPES).includes(req.query.type)) {
      query.type = req.query.type;
    }

    if (req.query.artFormId && mongoose.Types.ObjectId.isValid(req.query.artFormId)) {
      query.artFormId = req.query.artFormId;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { summary: searchRegex }, { content: searchRegex }];
    }

    const totalKnowledge = await KnowledgeItem.countDocuments(query);
    const items = await KnowledgeItem.find(query)
      .populate('artFormId', 'name slug')
      .populate('artistIds', 'displayName location')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return sendSuccess(res, 'Knowledge items retrieved successfully', {
      totalKnowledge,
      page,
      limit,
      totalPages: Math.ceil(totalKnowledge / limit) || 1,
      items
    });
  } catch (error) {
    console.error('Error in getKnowledgeItems:', error);
    return sendError(res, 'Failed to retrieve knowledge items', error.message, 500);
  }
};

/**
 * POST /api/admin/knowledge
 * Create a new knowledge/archive entry
 */
const createKnowledgeItem = async (req, res) => {
  try {
    const {
      title,
      type,
      artFormId,
      artistIds,
      content,
      summary,
      sources,
      language,
      status
    } = req.body;

    const validationErrors = [];

    if (!title || typeof title !== 'string' || !title.trim()) {
      validationErrors.push({ field: 'title', message: 'Title is required.' });
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      validationErrors.push({ field: 'content', message: 'Content is required.' });
    }

    if (type && !Object.values(KNOWLEDGE_TYPES).includes(type)) {
      validationErrors.push({
        field: 'type',
        message: `Invalid type. Allowed: ${Object.values(KNOWLEDGE_TYPES).join(', ')}`
      });
    }

    if (status && !Object.values(KNOWLEDGE_STATUS).includes(status)) {
      validationErrors.push({
        field: 'status',
        message: `Invalid status. Allowed: ${Object.values(KNOWLEDGE_STATUS).join(', ')}`
      });
    }

    if (artFormId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(artFormId)) {
        validationErrors.push({ field: 'artFormId', message: 'Invalid artFormId format.' });
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

    const item = await KnowledgeItem.create({
      title: title.trim(),
      type: type || KNOWLEDGE_TYPES.ARTICLE,
      artFormId: artFormId || null,
      artistIds: Array.isArray(artistIds) ? artistIds : [],
      content: content.trim(),
      summary: summary ? summary.trim() : '',
      sources: Array.isArray(sources) ? sources : [],
      language: language ? language.trim() : 'en',
      status: status || KNOWLEDGE_STATUS.DRAFT,
      createdBy: req.user._id,
      media: []
    });

    const populatedItem = await KnowledgeItem.findById(item._id)
      .populate('artFormId', 'name slug')
      .populate('artistIds', 'displayName location');

    return sendSuccess(res, 'Knowledge item created successfully', populatedItem, 201);
  } catch (error) {
    console.error('Error in createKnowledgeItem:', error);
    return sendError(res, 'Failed to create knowledge item', error.message, 500);
  }
};

/**
 * PATCH /api/admin/knowledge/:id
 * Update knowledge item content, metadata, or publication workflow status
 */
const updateKnowledgeItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid knowledge ID format.', null, 400);
    }

    const item = await KnowledgeItem.findById(id);
    if (!item) {
      return sendError(res, 'Knowledge item not found.', null, 404);
    }

    const {
      title,
      type,
      artFormId,
      artistIds,
      content,
      summary,
      sources,
      language,
      status
    } = req.body;

    const validationErrors = [];

    if (status && !Object.values(KNOWLEDGE_STATUS).includes(status)) {
      validationErrors.push({
        field: 'status',
        message: `Invalid status. Allowed: ${Object.values(KNOWLEDGE_STATUS).join(', ')}`
      });
    }

    if (type && !Object.values(KNOWLEDGE_TYPES).includes(type)) {
      validationErrors.push({
        field: 'type',
        message: `Invalid type. Allowed: ${Object.values(KNOWLEDGE_TYPES).join(', ')}`
      });
    }

    if (artFormId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(artFormId)) {
        validationErrors.push({ field: 'artFormId', message: 'Invalid artFormId format.' });
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

    if (title) item.title = title.trim();
    if (type) item.type = type;
    if (artFormId !== undefined) item.artFormId = artFormId;
    if (artistIds) item.artistIds = artistIds;
    if (content !== undefined) item.content = content.trim();
    if (summary !== undefined) item.summary = summary.trim();
    if (sources) item.sources = sources;
    if (language) item.language = language.trim();
    if (status) item.status = status;

    await item.save();

    const updatedItem = await KnowledgeItem.findById(item._id)
      .populate('artFormId', 'name slug')
      .populate('artistIds', 'displayName location');

    return sendSuccess(res, 'Knowledge item updated successfully', updatedItem);
  } catch (error) {
    console.error('Error in updateKnowledgeItem:', error);
    return sendError(res, 'Failed to update knowledge item', error.message, 500);
  }
};

/**
 * DELETE /api/admin/knowledge/:id
 * Archive or delete cultural knowledge entry
 */
const deleteKnowledgeItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid knowledge ID format.', null, 400);
    }

    const item = await KnowledgeItem.findById(id);
    if (!item) {
      return sendError(res, 'Knowledge item not found.', null, 404);
    }

    // If published, archive it to preserve cultural documentation history
    if (item.status === KNOWLEDGE_STATUS.PUBLISHED) {
      item.status = KNOWLEDGE_STATUS.ARCHIVED;
      await item.save();
      return sendSuccess(res, 'Knowledge item archived successfully to preserve cultural documentation.', {
        id: item._id,
        status: KNOWLEDGE_STATUS.ARCHIVED
      });
    }

    // Draft or review can be hard deleted
    await KnowledgeItem.findByIdAndDelete(id);
    return sendSuccess(res, 'Knowledge item deleted successfully', { id });
  } catch (error) {
    console.error('Error in deleteKnowledgeItem:', error);
    return sendError(res, 'Failed to delete knowledge item', error.message, 500);
  }
};

/**
 * POST /api/admin/knowledge/:id/media
 * Upload archival images/videos for cultural knowledge documentation
 */
const uploadKnowledgeMedia = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid knowledge ID format.', null, 400);
    }

    if (!req.file) {
      return sendError(res, 'No media file provided for upload.', null, 400);
    }

    const item = await KnowledgeItem.findById(id);
    if (!item) {
      return sendError(res, 'Knowledge item not found.', null, 404);
    }

    const isVideo = req.file.mimetype.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: `tvarita/knowledge/${item._id}`,
      resource_type: resourceType
    });

    const mediaItem = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      type: isVideo ? MEDIA_TYPES.VIDEO : MEDIA_TYPES.IMAGE,
      title: req.body.title ? req.body.title.trim() : (req.file.originalname || '')
    };

    item.media.push(mediaItem);
    await item.save();

    const savedMedia = item.media[item.media.length - 1];

    return sendSuccess(res, 'Knowledge media uploaded successfully', savedMedia, 201);
  } catch (error) {
    console.error('Error in uploadKnowledgeMedia:', error);
    return sendError(res, 'Failed to upload knowledge media', error.message, 500);
  }
};

module.exports = {
  getKnowledgeItems,
  createKnowledgeItem,
  updateKnowledgeItem,
  deleteKnowledgeItem,
  uploadKnowledgeMedia
};
