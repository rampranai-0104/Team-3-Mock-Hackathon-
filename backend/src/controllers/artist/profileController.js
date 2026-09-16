const mongoose = require('mongoose');
const Artist = require('../../models/Artist');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../services/cloudinaryService');
const { MEDIA_TYPES } = require('../../constants');

/**
 * GET /api/artists/me
 * Returns the currently authenticated artist's profile
 */
const getOwnProfile = async (req, res) => {
  try {
    const artist = await Artist.findOne({ userId: req.user._id })
      .populate('artFormIds', 'name slug description')
      .populate('userId', 'name email phone avatar');

    if (!artist) {
      return sendError(res, 'Artist profile not found for this account.', null, 404);
    }

    return sendSuccess(res, 'Artist profile retrieved successfully', artist);
  } catch (error) {
    console.error('Error in getOwnProfile:', error);
    return sendError(res, 'Failed to retrieve artist profile', error.message, 500);
  }
};

/**
 * PATCH /api/artists/me
 * Allows authenticated artist to update their own editable profile fields
 */
const updateOwnProfile = async (req, res) => {
  try {
    const artist = await Artist.findOne({ userId: req.user._id });

    if (!artist) {
      return sendError(res, 'Artist profile not found for this account.', null, 404);
    }

    // List of allowed fields that artist can update
    const allowedFields = [
      'displayName',
      'bio',
      'artFormIds',
      'location',
      'languages',
      'experience',
      'availability'
    ];

    const updates = {};
    const validationErrors = [];

    // Check for attempts to tamper with protected fields
    if (req.body.userId && req.body.userId.toString() !== req.user._id.toString()) {
      validationErrors.push({ field: 'userId', message: 'Modifying userId is not permitted.' });
    }

    if (req.body.verificationStatus && req.body.verificationStatus !== artist.verificationStatus) {
      validationErrors.push({
        field: 'verificationStatus',
        message: 'Modifying verificationStatus is restricted to administrators.'
      });
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed: Protected fields cannot be modified.', validationErrors, 400);
    }

    // Validate and process allowed fields
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        // Field-specific validation
        if (field === 'displayName') {
          if (typeof req.body.displayName !== 'string' || !req.body.displayName.trim()) {
            validationErrors.push({ field: 'displayName', message: 'Display name cannot be empty.' });
          } else {
            updates.displayName = req.body.displayName.trim();
          }
        } else if (field === 'bio') {
          if (typeof req.body.bio !== 'string') {
            validationErrors.push({ field: 'bio', message: 'Bio must be a string.' });
          } else {
            updates.bio = req.body.bio.trim();
          }
        } else if (field === 'experience') {
          const expNum = Number(req.body.experience);
          if (isNaN(expNum) || expNum < 0) {
            validationErrors.push({ field: 'experience', message: 'Experience must be a non-negative number.' });
          } else {
            updates.experience = expNum;
          }
        } else if (field === 'languages') {
          if (!Array.isArray(req.body.languages)) {
            validationErrors.push({ field: 'languages', message: 'Languages must be an array of strings.' });
          } else {
            updates.languages = req.body.languages
              .filter(lang => typeof lang === 'string' && lang.trim())
              .map(lang => lang.trim());
          }
        } else if (field === 'artFormIds') {
          if (!Array.isArray(req.body.artFormIds)) {
            validationErrors.push({ field: 'artFormIds', message: 'artFormIds must be an array of IDs.' });
          } else {
            const validIds = [];
            for (const id of req.body.artFormIds) {
              if (mongoose.Types.ObjectId.isValid(id)) {
                validIds.push(id);
              } else {
                validationErrors.push({ field: 'artFormIds', message: `Invalid ObjectId: ${id}` });
              }
            }
            updates.artFormIds = validIds;
          }
        } else if (field === 'location') {
          if (typeof req.body.location === 'object' && req.body.location !== null) {
            updates.location = {
              city: req.body.location.city ? req.body.location.city.trim() : artist.location.city,
              state: req.body.location.state ? req.body.location.state.trim() : artist.location.state,
              country: req.body.location.country ? req.body.location.country.trim() : artist.location.country
            };
          } else if (typeof req.body.location === 'string') {
            updates.location = {
              ...artist.location,
              city: req.body.location.trim()
            };
          }
        } else if (field === 'availability') {
          if (typeof req.body.availability === 'object' && req.body.availability !== null) {
            updates.availability = {
              isAvailable: req.body.availability.isAvailable !== undefined
                ? Boolean(req.body.availability.isAvailable)
                : artist.availability.isAvailable,
              notes: req.body.availability.notes !== undefined
                ? String(req.body.availability.notes).trim()
                : artist.availability.notes
            };
          } else if (typeof req.body.availability === 'boolean') {
            updates.availability = {
              ...artist.availability,
              isAvailable: req.body.availability
            };
          }
        }
      }
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    // Apply updates
    Object.assign(artist, updates);
    const updatedArtist = await artist.save();

    await updatedArtist.populate('artFormIds', 'name slug description');

    return sendSuccess(res, 'Artist profile updated successfully', updatedArtist);
  } catch (error) {
    console.error('Error in updateOwnProfile:', error);
    return sendError(res, 'Failed to update artist profile', error.message, 500);
  }
};

/**
 * POST /api/artists/me/media
 * Upload profile/gallery/video media to Cloudinary and append to artist.media
 */
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No media file provided for upload.', null, 400);
    }

    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found for this account.', null, 404);
    }

    // Determine resource type from mimetype
    const isVideo = req.file.mimetype.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    // Upload to Cloudinary via service
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: `tvarita/artists/${artist._id}`,
      resource_type: resourceType
    });

    // Create new media item adhering to Artist.js media schema
    const mediaItem = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      type: req.body.type && Object.values(MEDIA_TYPES).includes(req.body.type)
        ? req.body.type
        : (isVideo ? MEDIA_TYPES.VIDEO : MEDIA_TYPES.IMAGE),
      title: req.body.title ? req.body.title.trim() : (req.file.originalname || ''),
      description: req.body.description ? req.body.description.trim() : '',
      createdAt: new Date()
    };

    artist.media.push(mediaItem);
    await artist.save();

    // Get the newly saved subdocument with its generated _id
    const savedMediaItem = artist.media[artist.media.length - 1];

    return sendSuccess(res, 'Media uploaded successfully', savedMediaItem, 201);
  } catch (error) {
    console.error('Error in uploadMedia:', error);
    return sendError(res, 'Failed to upload media', error.message, 500);
  }
};

/**
 * DELETE /api/artists/me/media/:mediaId
 * Remove media asset from Cloudinary and artist's media array
 */
const deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(mediaId)) {
      return sendError(res, 'Invalid media ID format.', null, 400);
    }

    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found for this account.', null, 404);
    }

    // Find media subdocument inside artist's own media array
    const mediaItem = artist.media.id(mediaId);
    if (!mediaItem) {
      return sendError(res, 'Media asset not found in your profile.', null, 404);
    }

    // Remove from Cloudinary if publicId exists
    if (mediaItem.publicId) {
      try {
        await deleteFromCloudinary(
          mediaItem.publicId,
          mediaItem.type === MEDIA_TYPES.VIDEO ? 'video' : 'image'
        );
      } catch (cloudErr) {
        console.warn('Cloudinary deletion warning (proceeding with DB deletion):', cloudErr.message);
      }
    }

    // Remove from MongoDB
    artist.media.pull(mediaId);
    await artist.save();

    return sendSuccess(res, 'Media asset deleted successfully', { mediaId });
  } catch (error) {
    console.error('Error in deleteMedia:', error);
    return sendError(res, 'Failed to delete media asset', error.message, 500);
  }
};

module.exports = {
  getOwnProfile,
  updateOwnProfile,
  uploadMedia,
  deleteMedia
};
