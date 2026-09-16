const mongoose = require('mongoose');
const Artist = require('../../models/Artist');
const User = require('../../models/User');
const ArtForm = require('../../models/ArtForm');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { createNotification } = require('../../services/notificationService');
const { ARTIST_VERIFICATION_STATUS, ROLES } = require('../../constants');
const { parseCSV } = require('../../utils/csvParser');

/**
 * Calculate profile completeness percentage based on essential fields
 */
const calculateProfileCompleteness = (artist) => {
  let score = 0;
  const weights = {
    displayName: 15,
    bio: 15,
    artFormIds: 20,
    location: 15,
    languages: 10,
    experience: 10,
    media: 15
  };

  if (artist.displayName && artist.displayName.trim().length > 0) score += weights.displayName;
  if (artist.bio && artist.bio.trim().length > 10) score += weights.bio;
  if (Array.isArray(artist.artFormIds) && artist.artFormIds.length > 0) score += weights.artFormIds;
  if (artist.location && (artist.location.city || artist.location.state)) score += weights.location;
  if (Array.isArray(artist.languages) && artist.languages.length > 0) score += weights.languages;
  if (artist.experience !== undefined && artist.experience !== null && artist.experience > 0) score += weights.experience;
  if (Array.isArray(artist.media) && artist.media.length > 0) score += weights.media;

  return Math.min(100, score);
};

/**
 * GET /api/admin/artists
 * List and filter artist profiles (supports hasUserAccount, location, search, verificationStatus, artFormId)
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

    if (req.query.hasUserAccount !== undefined) {
      if (req.query.hasUserAccount === 'true' || req.query.hasUserAccount === true) {
        query.userId = { $exists: true, $ne: null };
      } else if (req.query.hasUserAccount === 'false' || req.query.hasUserAccount === false) {
        query.userId = null;
      }
    }

    if (req.query.location) {
      const locRegex = new RegExp(req.query.location.trim(), 'i');
      query.$or = [{ 'location.city': locRegex }, { 'location.state': locRegex }];
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      const searchConditions = [
        { displayName: searchRegex },
        { bio: searchRegex },
        { 'location.city': searchRegex },
        { 'location.state': searchRegex }
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    const totalArtists = await Artist.countDocuments(query);
    const artistsRaw = await Artist.find(query)
      .populate('userId', 'name email phone avatar status')
      .populate('artFormIds', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const artists = artistsRaw.map(artist => ({
      ...artist,
      hasUserAccount: Boolean(artist.userId),
      profileCompleteness: calculateProfileCompleteness(artist)
    }));

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
 * Retrieve detailed artist information with administrative convenience fields
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

    const artistObj = artist.toObject();
    artistObj.hasUserAccount = Boolean(artist.userId);
    artistObj.profileCompleteness = calculateProfileCompleteness(artistObj);

    return sendSuccess(res, 'Artist details retrieved successfully', artistObj);
  } catch (error) {
    console.error('Error in getArtistById:', error);
    return sendError(res, 'Failed to retrieve artist', error.message, 500);
  }
};

/**
 * POST /api/admin/artists
 * Manually provision an artist profile with or without a User account
 */
const createArtist = async (req, res) => {
  try {
    const { userId, displayName, bio, artFormIds, location, languages, experience, verificationStatus, availability } = req.body;

    const validationErrors = [];

    let targetUserId = null;
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        validationErrors.push({ field: 'userId', message: 'Valid userId is required when linking an account.' });
      } else {
        const user = await User.findById(userId);
        if (!user) {
          validationErrors.push({ field: 'userId', message: 'User not found.' });
        } else {
          const existingProfile = await Artist.findOne({ userId });
          if (existingProfile) {
            validationErrors.push({ field: 'userId', message: 'Artist profile already exists for this user.' });
          } else {
            targetUserId = userId;
          }
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

    // If userId provided, ensure user role is updated to artist
    if (targetUserId) {
      await User.findByIdAndUpdate(targetUserId, { role: ROLES.ARTIST });
    }

    // Format location
    let formattedLocation = { city: '', state: '', country: 'India' };
    if (typeof location === 'object' && location !== null) {
      formattedLocation = {
        city: location.city ? String(location.city).trim() : '',
        state: location.state ? String(location.state).trim() : '',
        country: location.country ? String(location.country).trim() : 'India'
      };
    } else if (typeof location === 'string' && location.trim()) {
      const parts = location.split(',').map(s => s.trim());
      formattedLocation.city = parts[0] || '';
      formattedLocation.state = parts[1] || '';
    }

    const artistData = {
      displayName: displayName.trim(),
      bio: bio ? bio.trim() : '',
      artFormIds: Array.isArray(artFormIds) ? artFormIds : [],
      location: formattedLocation,
      languages: Array.isArray(languages) ? languages : [],
      experience: experience !== undefined ? Number(experience) : 0,
      verificationStatus: verificationStatus || ARTIST_VERIFICATION_STATUS.APPROVED,
      availability: availability || { isAvailable: true, notes: '' }
    };

    if (targetUserId) {
      artistData.userId = targetUserId;
    }

    const artist = await Artist.create(artistData);

    const populatedArtist = await Artist.findById(artist._id)
      .populate('userId', 'name email phone avatar')
      .populate('artFormIds', 'name slug');

    const resultObj = populatedArtist.toObject();
    resultObj.hasUserAccount = Boolean(resultObj.userId);
    resultObj.profileCompleteness = calculateProfileCompleteness(resultObj);

    return sendSuccess(res, 'Artist created successfully', resultObj, 201);
  } catch (error) {
    console.error('Error in createArtist:', error);
    return sendError(res, 'Failed to create artist', error.message, 500);
  }
};

/**
 * PATCH /api/admin/artists/:id
 * Update artist details or verification status, or link an existing User account
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
      userId,
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

    // Optional account linking: link user if artist doesn't have one, or change user safely
    if (userId !== undefined) {
      if (userId === null || userId === '') {
        artist.userId = undefined;
      } else if (!mongoose.Types.ObjectId.isValid(userId)) {
        validationErrors.push({ field: 'userId', message: 'Valid userId format is required.' });
      } else {
        const user = await User.findById(userId);
        if (!user) {
          validationErrors.push({ field: 'userId', message: 'User to link was not found.' });
        } else {
          // Check if another artist already has this userId
          const otherArtist = await Artist.findOne({ userId, _id: { $ne: artist._id } });
          if (otherArtist) {
            validationErrors.push({ field: 'userId', message: 'This user account is already linked to another artist profile.' });
          } else {
            artist.userId = userId;
            await User.findByIdAndUpdate(userId, { role: ROLES.ARTIST });
          }
        }
      }
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

    if (displayName) artist.displayName = displayName.trim();
    if (bio !== undefined) artist.bio = bio.trim();
    if (artFormIds) artist.artFormIds = artFormIds;
    if (location) {
      if (typeof location === 'object') {
        artist.location = { ...artist.location, ...location };
      } else if (typeof location === 'string') {
        const parts = location.split(',').map(s => s.trim());
        artist.location.city = parts[0] || artist.location.city;
        artist.location.state = parts[1] || artist.location.state;
      }
    }
    if (languages) artist.languages = Array.isArray(languages) ? languages : [languages];
    if (experience !== undefined) artist.experience = Number(experience);
    if (verificationStatus) artist.verificationStatus = verificationStatus;
    if (rejectionReason !== undefined) artist.rejectionReason = rejectionReason.trim();
    if (availability) artist.availability = { ...artist.availability, ...availability };

    await artist.save();

    const updatedArtist = await Artist.findById(artist._id)
      .populate('userId', 'name email phone avatar')
      .populate('artFormIds', 'name slug');

    const resultObj = updatedArtist.toObject();
    resultObj.hasUserAccount = Boolean(resultObj.userId);
    resultObj.profileCompleteness = calculateProfileCompleteness(resultObj);

    return sendSuccess(res, 'Artist updated successfully', resultObj);
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

    // Notify artist if user account exists
    if (artist.userId) {
      await createNotification({
        userId: artist.userId,
        type: 'artist_approved',
        title: 'Profile Approved',
        message: 'Congratulations! Your artist profile has been approved by the Tvarita administration.',
        entityId: artist._id,
        entityType: 'Artist'
      });
    }

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

    // Notify artist if user account exists
    if (artist.userId) {
      await createNotification({
        userId: artist.userId,
        type: 'artist_rejected',
        title: 'Profile Application Update',
        message: `Your artist onboarding application was not approved. Reason: ${artist.rejectionReason}`,
        entityId: artist._id,
        entityType: 'Artist'
      });
    }

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

/**
 * POST /api/admin/artists/bulk-import
 * Batch import artist profiles from CSV file or raw CSV text
 */
const bulkImportArtists = async (req, res) => {
  try {
    let csvContent = '';

    if (req.file && req.file.buffer) {
      csvContent = req.file.buffer.toString('utf-8');
    } else if (req.body && req.body.csvData) {
      csvContent = req.body.csvData;
    } else if (typeof req.body === 'string' && req.body.trim().startsWith('displayName')) {
      csvContent = req.body;
    }

    if (!csvContent || !csvContent.trim()) {
      return sendError(res, 'No CSV file or CSV content provided for import.', null, 400);
    }

    const rows = parseCSV(csvContent);
    if (rows.length === 0) {
      return sendError(res, 'CSV content is empty or contains only headers.', null, 400);
    }

    // Cache art forms for name/slug matching
    const allArtForms = await ArtForm.find({}).lean();
    const artFormMap = new Map();
    allArtForms.forEach(af => {
      artFormMap.set(af.name.toLowerCase(), af._id);
      artFormMap.set(af.slug.toLowerCase(), af._id);
      artFormMap.set(af._id.toString(), af._id);
    });

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
      const displayName = row.displayName ? row.displayName.trim() : '';

      if (!displayName) {
        summary.failed++;
        summary.errors.push({
          row: rowNum,
          field: 'displayName',
          message: 'Missing required field: displayName'
        });
        continue;
      }

      // Verification status validation
      let verificationStatus = ARTIST_VERIFICATION_STATUS.APPROVED;
      if (row.verificationStatus && row.verificationStatus.trim()) {
        const inputStatus = row.verificationStatus.trim().toLowerCase();
        if (Object.values(ARTIST_VERIFICATION_STATUS).includes(inputStatus)) {
          verificationStatus = inputStatus;
        } else {
          summary.failed++;
          summary.errors.push({
            row: rowNum,
            field: 'verificationStatus',
            message: `Invalid verification status '${row.verificationStatus}'. Allowed: ${Object.values(ARTIST_VERIFICATION_STATUS).join(', ')}`
          });
          continue;
        }
      }

      // Parse art forms (split by semicolon or comma)
      const matchedArtFormIds = [];
      if (row.artForms && row.artForms.trim()) {
        const artFormTokens = row.artForms.split(/[;,]/).map(t => t.trim().toLowerCase()).filter(Boolean);
        let hasInvalidArtForm = false;
        for (const token of artFormTokens) {
          if (artFormMap.has(token)) {
            matchedArtFormIds.push(artFormMap.get(token));
          } else {
            hasInvalidArtForm = true;
            summary.failed++;
            summary.errors.push({
              row: rowNum,
              field: 'artForms',
              message: `Unrecognized art form '${token}'. Art forms must match existing active art forms.`
            });
            break;
          }
        }
        if (hasInvalidArtForm) {
          continue;
        }
      }

      // Parse Location
      let city = '';
      let state = '';
      let country = 'India';
      if (row.location && row.location.trim()) {
        const locParts = row.location.split(/[,;]/).map(p => p.trim());
        city = locParts[0] || '';
        state = locParts[1] || '';
        if (locParts[2]) country = locParts[2];
      }

      // Parse Languages
      const languages = row.languages
        ? row.languages.split(/[;,]/).map(l => l.trim()).filter(Boolean)
        : [];

      // Parse Experience
      let experienceYears = 0;
      if (row.experience) {
        const parsedExp = parseInt(row.experience.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsedExp)) experienceYears = parsedExp;
      }

      // Parse Availability
      const isAvailable = row.availability ? !row.availability.toLowerCase().includes('unavailable') : true;

      // Duplicate detection by displayName + location (city/state)
      const duplicateQuery = {
        displayName: new RegExp(`^${displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')
      };
      if (city) {
        duplicateQuery['location.city'] = new RegExp(`^${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
      }

      const existingArtist = await Artist.findOne(duplicateQuery);
      if (existingArtist) {
        // Safe update of unpopulated fields without destroying custom media/details
        if (!existingArtist.bio && row.bio) existingArtist.bio = row.bio.trim();
        if (matchedArtFormIds.length > 0 && (!existingArtist.artFormIds || existingArtist.artFormIds.length === 0)) {
          existingArtist.artFormIds = matchedArtFormIds;
        }
        await existingArtist.save();
        summary.updated++;
        continue;
      }

      // Create new Artist (NO fake user)
      await Artist.create({
        displayName,
        bio: row.bio ? row.bio.trim() : '',
        artFormIds: matchedArtFormIds,
        location: { city, state, country },
        languages,
        experience: experienceYears,
        verificationStatus,
        availability: { isAvailable, notes: '' }
      });

      summary.created++;
    }

    return sendSuccess(res, 'Bulk artist import completed', summary);
  } catch (error) {
    console.error('Error in bulkImportArtists:', error);
    return sendError(res, 'Failed to perform bulk artist import', error.message, 500);
  }
};

module.exports = {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
  approveArtist,
  rejectArtist,
  bulkImportArtists
};
