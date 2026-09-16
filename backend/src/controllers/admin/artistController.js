const mongoose = require('mongoose');
const Artist = require('../../models/Artist');
const User = require('../../models/User');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { createNotification } = require('../../services/notificationService');
const { ARTIST_VERIFICATION_STATUS, ROLES } = require('../../constants');

/**
 * GET /api/admin/artists
 * List and filter artist profiles
 */
const getArtists = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.verificationStatus && Object.values(ARTIST_VERIFICATION_STATUS).includes(req.query.verificationStatus)) {
      query.verificationStatus = req.query.verificationStatus;
    }

    if (req.query.artFormId && mongoose.Types.ObjectId.isValid(req.query.artFormId)) {
      query.artFormIds = req.query.artFormId;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [
        { displayName: searchRegex },
        { bio: searchRegex },
        { 'location.city': searchRegex },
        { 'location.state': searchRegex }
      ];
    }

    const totalArtists = await Artist.countDocuments(query);
    const artists = await Artist.find(query)
      .populate('userId', 'name email phone avatar status')
      .populate('artFormIds', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return sendSuccess(res, 'Artists retrieved successfully', {
      totalArtists,
      page,
      limit,
      totalPages: Math.ceil(totalArtists / limit) || 1,
      artists
    });
  } catch (error) {
    console.error('Error in getArtists:', error);
    return sendError(res, 'Failed to retrieve artists', error.message, 500);
  }
};

/**
 * GET /api/admin/artists/:id
 * Retrieve detailed artist information
 */
const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid artist ID format.', null, 400);
    }

    const artist = await Artist.findById(id)
      .populate('userId', 'name email phone avatar status')
      .populate('artFormIds', 'name slug description');

    if (!artist) {
      return sendError(res, 'Artist not found.', null, 404);
    }

    return sendSuccess(res, 'Artist details retrieved successfully', artist);
  } catch (error) {
    console.error('Error in getArtistById:', error);
    return sendError(res, 'Failed to retrieve artist', error.message, 500);
  }
};

/**
 * POST /api/admin/artists
 * Manually provision an artist profile for a user
 */
const createArtist = async (req, res) => {
  try {
    const { userId, displayName, bio, artFormIds, location, languages, experience, verificationStatus } = req.body;

    const validationErrors = [];

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      validationErrors.push({ field: 'userId', message: 'Valid userId is required.' });
    } else {
      const user = await User.findById(userId);
      if (!user) {
        validationErrors.push({ field: 'userId', message: 'User not found.' });
      } else {
        const existingProfile = await Artist.findOne({ userId });
        if (existingProfile) {
          validationErrors.push({ field: 'userId', message: 'Artist profile already exists for this user.' });
        }
      }
    }

    if (!displayName || typeof displayName !== 'string' || !displayName.trim()) {
      validationErrors.push({ field: 'displayName', message: 'Display name is required.' });
    }

    if (verificationStatus && !Object.values(ARTIST_VERIFICATION_STATUS).includes(verificationStatus)) {
      validationErrors.push({
        field: 'verificationStatus',
        message: `Invalid verificationStatus. Allowed: ${Object.values(ARTIST_VERIFICATION_STATUS).join(', ')}`
      });
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    // Ensure user role is updated to artist if not already
    await User.findByIdAndUpdate(userId, { role: ROLES.ARTIST });

    const artist = await Artist.create({
      userId,
      displayName: displayName.trim(),
      bio: bio ? bio.trim() : '',
      artFormIds: Array.isArray(artFormIds) ? artFormIds : [],
      location: location || {},
      languages: Array.isArray(languages) ? languages : [],
      experience: experience !== undefined ? Number(experience) : 0,
      verificationStatus: verificationStatus || ARTIST_VERIFICATION_STATUS.APPROVED
    });

    const populatedArtist = await Artist.findById(artist._id)
      .populate('userId', 'name email phone avatar')
      .populate('artFormIds', 'name slug');

    return sendSuccess(res, 'Artist created successfully', populatedArtist, 201);
  } catch (error) {
    console.error('Error in createArtist:', error);
    return sendError(res, 'Failed to create artist', error.message, 500);
  }
};

/**
 * PATCH /api/admin/artists/:id
 * Update artist details or verification status
 */
const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid artist ID format.', null, 400);
    }

    const artist = await Artist.findById(id);
    if (!artist) {
      return sendError(res, 'Artist not found.', null, 404);
    }

    const {
      displayName,
      bio,
      artFormIds,
      location,
      languages,
      experience,
      verificationStatus,
      rejectionReason,
      availability
    } = req.body;

    const validationErrors = [];

    if (verificationStatus && !Object.values(ARTIST_VERIFICATION_STATUS).includes(verificationStatus)) {
      validationErrors.push({
        field: 'verificationStatus',
        message: `Invalid verificationStatus. Allowed: ${Object.values(ARTIST_VERIFICATION_STATUS).join(', ')}`
      });
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    if (displayName) artist.displayName = displayName.trim();
    if (bio !== undefined) artist.bio = bio.trim();
    if (artFormIds) artist.artFormIds = artFormIds;
    if (location) artist.location = { ...artist.location, ...location };
    if (languages) artist.languages = languages;
    if (experience !== undefined) artist.experience = Number(experience);
    if (verificationStatus) artist.verificationStatus = verificationStatus;
    if (rejectionReason !== undefined) artist.rejectionReason = rejectionReason.trim();
    if (availability) artist.availability = { ...artist.availability, ...availability };

    await artist.save();

    const updatedArtist = await Artist.findById(artist._id)
      .populate('userId', 'name email phone avatar')
      .populate('artFormIds', 'name slug');

    return sendSuccess(res, 'Artist updated successfully', updatedArtist);
  } catch (error) {
    console.error('Error in updateArtist:', error);
    return sendError(res, 'Failed to update artist', error.message, 500);
  }
};

/**
 * POST /api/admin/artists/:id/approve
 * Approve artist onboarding application
 */
const approveArtist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid artist ID format.', null, 400);
    }

    const artist = await Artist.findById(id);
    if (!artist) {
      return sendError(res, 'Artist not found.', null, 404);
    }

    artist.verificationStatus = ARTIST_VERIFICATION_STATUS.APPROVED;
    artist.rejectionReason = '';
    await artist.save();

    // Notify artist
    await createNotification({
      userId: artist.userId,
      type: 'artist_approved',
      title: 'Profile Approved',
      message: 'Congratulations! Your artist profile has been approved by the Tvarita administration.',
      entityId: artist._id,
      entityType: 'Artist'
    });

    return sendSuccess(res, 'Artist profile approved successfully', {
      id: artist._id,
      verificationStatus: artist.verificationStatus
    });
  } catch (error) {
    console.error('Error in approveArtist:', error);
    return sendError(res, 'Failed to approve artist', error.message, 500);
  }
};

/**
 * POST /api/admin/artists/:id/reject
 * Reject artist onboarding application with reason
 */
const rejectArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid artist ID format.', null, 400);
    }

    const artist = await Artist.findById(id);
    if (!artist) {
      return sendError(res, 'Artist not found.', null, 404);
    }

    artist.verificationStatus = ARTIST_VERIFICATION_STATUS.REJECTED;
    artist.rejectionReason = reason ? reason.trim() : 'Application does not meet onboarding criteria';
    await artist.save();

    // Notify artist
    await createNotification({
      userId: artist.userId,
      type: 'artist_rejected',
      title: 'Profile Application Update',
      message: `Your artist onboarding application was not approved. Reason: ${artist.rejectionReason}`,
      entityId: artist._id,
      entityType: 'Artist'
    });

    return sendSuccess(res, 'Artist profile rejected successfully', {
      id: artist._id,
      verificationStatus: artist.verificationStatus,
      rejectionReason: artist.rejectionReason
    });
  } catch (error) {
    console.error('Error in rejectArtist:', error);
    return sendError(res, 'Failed to reject artist', error.message, 500);
  }
};

module.exports = {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
  approveArtist,
  rejectArtist
};
