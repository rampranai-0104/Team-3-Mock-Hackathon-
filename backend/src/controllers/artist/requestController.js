const mongoose = require('mongoose');
const Request = require('../../models/Request');
const Artist = require('../../models/Artist');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { createNotification } = require('../../services/notificationService');
const { REQUEST_STATUS } = require('../../constants');

/**
 * GET /api/artists/me/requests
 * Returns all requests assigned to the authenticated artist
 */
const getRequests = async (req, res) => {
  try {
    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const query = { artistId: artist._id };

    // Optional query filters
    if (req.query.status && Object.values(REQUEST_STATUS).includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.requesterType && ['public', 'institution'].includes(req.query.requesterType)) {
      query.requesterType = req.query.requesterType;
    }

    const requests = await Request.find(query)
      .populate('requesterId', 'name email phone avatar role')
      .populate('artFormId', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, 'Artist requests retrieved successfully', requests);
  } catch (error) {
    console.error('Error in getRequests:', error);
    return sendError(res, 'Failed to retrieve requests', error.message, 500);
  }
};

/**
 * GET /api/artists/me/requests/:id
 * Returns details of one request belonging to the authenticated artist
 */
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid request ID format.', null, 400);
    }

    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const request = await Request.findOne({ _id: id, artistId: artist._id })
      .populate('requesterId', 'name email phone avatar role')
      .populate('artFormId', 'name slug description');

    if (!request) {
      return sendError(res, 'Request not found or not assigned to you.', null, 404);
    }

    return sendSuccess(res, 'Request details retrieved successfully', request);
  } catch (error) {
    console.error('Error in getRequestById:', error);
    return sendError(res, 'Failed to retrieve request details', error.message, 500);
  }
};

/**
 * PATCH /api/artists/me/requests/:id
 * Update status of an assigned request (accept / reject / complete / cancel)
 */
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid request ID format.', null, 400);
    }

    if (!status || !Object.values(REQUEST_STATUS).includes(status)) {
      return sendError(res, `Invalid or missing status. Allowed statuses: ${Object.values(REQUEST_STATUS).join(', ')}`, null, 400);
    }

    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const request = await Request.findOne({ _id: id, artistId: artist._id });
    if (!request) {
      return sendError(res, 'Request not found or not assigned to you.', null, 404);
    }

    // Controlled status transition checks
    const allowedTransitions = {
      [REQUEST_STATUS.PENDING]: [REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.REJECTED],
      [REQUEST_STATUS.ACCEPTED]: [REQUEST_STATUS.COMPLETED, REQUEST_STATUS.CANCELLED],
      [REQUEST_STATUS.REJECTED]: [],
      [REQUEST_STATUS.CANCELLED]: [],
      [REQUEST_STATUS.COMPLETED]: []
    };

    const validNextStates = allowedTransitions[request.status] || [];
    if (!validNextStates.includes(status)) {
      return sendError(
        res,
        `Cannot transition request from '${request.status}' to '${status}'. Allowed transitions from '${request.status}': ${validNextStates.join(', ') || 'None'}`,
        null,
        400
      );
    }

    // Update status
    request.status = status;
    await request.save();

    // Create notification for requester
    await createNotification({
      userId: request.requesterId,
      type: 'request_status_update',
      title: `Request ${status.toUpperCase()}`,
      message: `Artist ${artist.displayName} has updated your request status to '${status}'.`,
      entityId: request._id,
      entityType: 'Request'
    });

    const updatedRequest = await Request.findById(request._id)
      .populate('requesterId', 'name email phone avatar role')
      .populate('artFormId', 'name slug');

    return sendSuccess(res, `Request successfully marked as ${status}`, updatedRequest);
  } catch (error) {
    console.error('Error in updateRequestStatus:', error);
    return sendError(res, 'Failed to update request', error.message, 500);
  }
};

module.exports = {
  getRequests,
  getRequestById,
  updateRequestStatus
};
