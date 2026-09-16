const mongoose = require('mongoose');
const ArtForm = require('../../models/ArtForm');
const Artist = require('../../models/Artist');
const Event = require('../../models/Event');
const Product = require('../../models/Product');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../services/cloudinaryService');

const ARTFORM_IMAGE_FOLDER = 'tvarita/artforms';

// Helper to generate a slug from string
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

/**
 * GET /api/admin/art-forms
 * List art forms with optional filtering and search
 */
const getArtForms = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status && ['active', 'inactive', 'draft'].includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { slug: searchRegex }, { description: searchRegex }];
    }

    const totalArtForms = await ArtForm.countDocuments(query);
    const artForms = await ArtForm.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return sendSuccess(res, 'Art forms retrieved successfully', {
      totalArtForms,
      page,
      limit,
      totalPages: Math.ceil(totalArtForms / limit) || 1,
      artForms
    });
  } catch (error) {
    console.error('Error in getArtForms:', error);
    return sendError(res, 'Failed to retrieve art forms', error.message, 500);
  }
};

/**
 * POST /api/admin/art-forms
 * Create a new art form record
 */
const createArtForm = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      regions,
      history,
      techniques,
      materials,
      media,
      status
    } = req.body;

    const validationErrors = [];

    if (!name || typeof name !== 'string' || !name.trim()) {
      validationErrors.push({ field: 'name', message: 'Art form name is required.' });
    }

    const generatedSlug = (slug && slug.trim()) ? slugify(slug) : (name ? slugify(name) : '');
    if (!generatedSlug) {
      validationErrors.push({ field: 'slug', message: 'Valid slug could not be generated.' });
    } else {
      const existing = await ArtForm.findOne({ slug: generatedSlug });
      if (existing) {
        validationErrors.push({ field: 'slug', message: `Slug '${generatedSlug}' is already in use.` });
      }
    }

    if (status && !['active', 'inactive', 'draft'].includes(status)) {
      validationErrors.push({ field: 'status', message: 'Invalid status. Allowed: active, inactive, draft.' });
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    let image = { url: '', publicId: '' };
    if (req.file) {
      try {
        const uploaded = await uploadToCloudinary(req.file.buffer, ARTFORM_IMAGE_FOLDER);
        image = { url: uploaded.url, publicId: uploaded.publicId };
      } catch (uploadErr) {
        console.error('Error uploading art form image:', uploadErr);
        return sendError(res, `Image upload failed: ${uploadErr.message}`, null, 500);
      }
    }

    let artForm;
    try {
      artForm = await ArtForm.create({
        name: name.trim(),
        slug: generatedSlug,
        description: description ? description.trim() : '',
        regions: Array.isArray(regions) ? regions : [],
        history: history ? history.trim() : '',
        techniques: Array.isArray(techniques) ? techniques : [],
        materials: Array.isArray(materials) ? materials : [],
        media: Array.isArray(media) ? media : [],
        image,
        status: status || 'active'
      });
    } catch (saveError) {
      if (image.publicId) {
        try {
          await deleteFromCloudinary(image.publicId);
        } catch (cloudErr) {
          console.error(`Failed to roll back Cloudinary asset ${image.publicId}:`, cloudErr.message);
        }
      }
      throw saveError;
    }

    return sendSuccess(res, 'Art form created successfully', artForm, 201);
  } catch (error) {
    console.error('Error in createArtForm:', error);
    return sendError(res, 'Failed to create art form', error.message, 500);
  }
};

/**
 * PATCH /api/admin/art-forms/:id
 * Update an existing art form
 */
const updateArtForm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid art form ID format.', null, 400);
    }

    const artForm = await ArtForm.findById(id);
    if (!artForm) {
      return sendError(res, 'Art form not found.', null, 404);
    }

    const {
      name,
      slug,
      description,
      regions,
      history,
      techniques,
      materials,
      media,
      status
    } = req.body;

    const validationErrors = [];

    if (slug) {
      const targetSlug = slugify(slug);
      const conflict = await ArtForm.findOne({ slug: targetSlug, _id: { $ne: id } });
      if (conflict) {
        validationErrors.push({ field: 'slug', message: `Slug '${targetSlug}' is already used by another art form.` });
      } else {
        artForm.slug = targetSlug;
      }
    }

    if (status && !['active', 'inactive', 'draft'].includes(status)) {
      validationErrors.push({ field: 'status', message: 'Invalid status. Allowed: active, inactive, draft.' });
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    let newImage = null;
    if (req.file) {
      try {
        const uploaded = await uploadToCloudinary(req.file.buffer, ARTFORM_IMAGE_FOLDER);
        newImage = { url: uploaded.url, publicId: uploaded.publicId };
      } catch (uploadErr) {
        console.error('Error uploading art form image:', uploadErr);
        return sendError(res, `Image upload failed: ${uploadErr.message}`, null, 500);
      }
    }

    const oldImage = artForm.image;

    if (name) artForm.name = name.trim();
    if (description !== undefined) artForm.description = description.trim();
    if (regions) artForm.regions = regions;
    if (history !== undefined) artForm.history = history.trim();
    if (techniques) artForm.techniques = techniques;
    if (materials) artForm.materials = materials;
    if (media) artForm.media = media;
    if (status) artForm.status = status;
    if (newImage) artForm.image = newImage;

    try {
      await artForm.save();
    } catch (saveError) {
      if (newImage && newImage.publicId) {
        try {
          await deleteFromCloudinary(newImage.publicId);
        } catch (cloudErr) {
          console.error(`Failed to roll back Cloudinary asset ${newImage.publicId}:`, cloudErr.message);
        }
      }
      throw saveError;
    }

    if (newImage && oldImage && oldImage.publicId) {
      try {
        await deleteFromCloudinary(oldImage.publicId);
      } catch (cloudErr) {
        console.error(`Failed to delete old Cloudinary asset ${oldImage.publicId}:`, cloudErr.message);
      }
    }

    return sendSuccess(res, 'Art form updated successfully', artForm);
  } catch (error) {
    console.error('Error in updateArtForm:', error);
    return sendError(res, 'Failed to update art form', error.message, 500);
  }
};

/**
 * DELETE /api/admin/art-forms/:id
 * Archives or removes an art form (checks for active references)
 */
const deleteArtForm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid art form ID format.', null, 400);
    }

    const artForm = await ArtForm.findById(id);
    if (!artForm) {
      return sendError(res, 'Art form not found.', null, 404);
    }

    // Check references in Artist, Event, Product
    const [artistCount, eventCount, productCount] = await Promise.all([
      Artist.countDocuments({ artFormIds: id }),
      Event.countDocuments({ artFormIds: id }),
      Product.countDocuments({ artFormId: id })
    ]);

    const totalReferences = artistCount + eventCount + productCount;

    if (totalReferences > 0) {
      // Archive/deactivate rather than hard delete to preserve referential integrity
      artForm.status = 'inactive';
      await artForm.save();

      return sendSuccess(res, `Art form is referenced by ${totalReferences} records and was archived (status: inactive).`, {
        id: artForm._id,
        status: 'inactive',
        referencedBy: { artists: artistCount, events: eventCount, products: productCount }
      });
    }

    // If completely unreferenced, hard delete
    if (artForm.image && artForm.image.publicId) {
      try {
        await deleteFromCloudinary(artForm.image.publicId);
      } catch (cloudErr) {
        console.error(`Failed to delete Cloudinary asset ${artForm.image.publicId}:`, cloudErr.message);
      }
    }
    await ArtForm.findByIdAndDelete(id);
    return sendSuccess(res, 'Art form deleted successfully', { id });
  } catch (error) {
    console.error('Error in deleteArtForm:', error);
    return sendError(res, 'Failed to delete art form', error.message, 500);
  }
};

module.exports = {
  getArtForms,
  createArtForm,
  updateArtForm,
  deleteArtForm
};
