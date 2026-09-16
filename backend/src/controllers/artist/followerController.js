const Follow = require('../../models/Follow');
const Artist = require('../../models/Artist');
const { sendSuccess, sendError } = require('../../utils/apiResponse');

/**
 * GET /api/artists/me/followers
 * Returns list and count of users following the authenticated artist
 */
const getFollowers = async (req, res) => {
  try {
    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const totalFollowers = await Follow.countDocuments({ artistId: artist._id });

    const follows = await Follow.find({ artistId: artist._id })
      .populate('userId', 'name avatar preferredLanguage createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const followers = follows
      .filter((f) => f.userId) // Ensure user still exists
      .map((f) => ({
        followId: f._id,
        user: {
          id: f.userId._id,
          name: f.userId.name,
          avatar: f.userId.avatar,
          preferredLanguage: f.userId.preferredLanguage
        },
        followedAt: f.createdAt
      }));

    return sendSuccess(res, 'Followers retrieved successfully', {
      followerCount: totalFollowers,
      page,
      limit,
      totalPages: Math.ceil(totalFollowers / limit) || 1,
      followers
    });
  } catch (error) {
    console.error('Error in getFollowers:', error);
    return sendError(res, 'Failed to retrieve followers', error.message, 500);
  }
};

module.exports = {
  getFollowers
};
