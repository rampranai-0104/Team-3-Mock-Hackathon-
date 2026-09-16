const {
  getPlatformOverview,
  getArtistAnalytics,
  getArtFormAnalytics,
  getEngagementAnalytics,
  getRevenueAnalytics
} = require('../../services/analyticsService');
const { sendSuccess, sendError } = require('../../utils/apiResponse');

/**
 * GET /api/admin/analytics/overview
 */
const getOverview = async (req, res) => {
  try {
    const data = await getPlatformOverview();
    return sendSuccess(res, 'Overview analytics retrieved successfully', data);
  } catch (error) {
    console.error('Error in getOverview:', error);
    return sendError(res, 'Failed to retrieve overview analytics', error.message, 500);
  }
};

/**
 * GET /api/admin/analytics/artists
 */
const getArtists = async (req, res) => {
  try {
    const data = await getArtistAnalytics();
    return sendSuccess(res, 'Artist analytics retrieved successfully', data);
  } catch (error) {
    console.error('Error in getArtists:', error);
    return sendError(res, 'Failed to retrieve artist analytics', error.message, 500);
  }
};

/**
 * GET /api/admin/analytics/art-forms
 */
const getArtForms = async (req, res) => {
  try {
    const data = await getArtFormAnalytics();
    return sendSuccess(res, 'Art-form analytics retrieved successfully', data);
  } catch (error) {
    console.error('Error in getArtForms:', error);
    return sendError(res, 'Failed to retrieve art-form analytics', error.message, 500);
  }
};

/**
 * GET /api/admin/analytics/engagement
 */
const getEngagement = async (req, res) => {
  try {
    const data = await getEngagementAnalytics();
    return sendSuccess(res, 'Engagement analytics retrieved successfully', data);
  } catch (error) {
    console.error('Error in getEngagement:', error);
    return sendError(res, 'Failed to retrieve engagement analytics', error.message, 500);
  }
};

/**
 * GET /api/admin/analytics/revenue
 */
const getRevenue = async (req, res) => {
  try {
    const data = await getRevenueAnalytics();
    return sendSuccess(res, 'Revenue analytics retrieved successfully', data);
  } catch (error) {
    console.error('Error in getRevenue:', error);
    return sendError(res, 'Failed to retrieve revenue analytics', error.message, 500);
  }
};

module.exports = {
  getOverview,
  getArtists,
  getArtForms,
  getEngagement,
  getRevenue
};
