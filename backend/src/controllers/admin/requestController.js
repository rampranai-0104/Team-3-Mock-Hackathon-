const mongoose = require('mongoose');
const Request = require('../../models/Request');
const Artist = require('../../models/Artist');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { createNotification } = require('../../services/notificationService');
const { REQUEST_STATUS } = require('../../constants');

/**
 * GET /api/admin/requests
 * List all individual and group/institution requests across the platform
 */
const getRequests = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status && Object.values(REQUEST_STATUS).includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.requesterType && ['public', 'institution'].includes(req.query.requesterType)) {
      query.requesterType = req.query.requesterType;
    }

    if (req.query.artistId && mongoose.Types.ObjectId.isValid(req.query.artistId)) {
      query.artistId = req.query.artistId;
    }

    if (req.query.requesterId && mongoose.Types.ObjectId.isValid(req.query.requesterId)) {
      query.requesterId = req.query.requesterId;
    }

    const totalRequests = await Request.countDocuments(query);
    const requests = await Request.find(query)
      .populate('requesterId', 'name email phone avatar role')
      .populate('artistId', 'displayName location')
      .populate('artFormId', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return sendSuccess(res, 'Requests retrieved successfully', {
      totalRequests,
      page,
      limit,
      totalPages: Math.ceil(totalRequests / limit) || 1,
      requests
    });
  } catch (error) {
    console.error('Error in getRequests:', error);
    return sendError(res, 'Failed to retrieve requests', error.message, 500);
  }
};

/**
 * PATCH /api/admin/requests/:id
 * Admin updates request status or reassigns artist
 */
const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid request ID format.', null, 400);
    }

    const request = await Request.findById(id);
    if (!request) {
      return sendError(res, 'Request not found.', null, 404);
    }

    const { status, artistId, message } = req.body;
    const validationErrors = [];

    if (status && !Object.values(REQUEST_STATUS).includes(status)) {
      validationErrors.push({
        field: 'status',
        message: `Invalid status. Allowed: ${Object.values(REQUEST_STATUS).join(', ')}`
      });
    }

    if (artistId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(artistId)) {
        validationErrors.push({ field: 'artistId', message: 'Invalid artist ID format.' });
      } else {
        const artistExists = await Artist.findById(artistId);
        if (!artistExists) {
          validationErrors.push({ field: 'artistId', message: 'Referenced artist does not exist.' });
        }
      }
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    const oldStatus = request.status;
    if (status) request.status = status;
    if (artistId) request.artistId = artistId;
    if (message !== undefined) request.message = message.trim();

    await request.save();

    // Trigger notifications for requester and artist on status change
    if (status && oldStatus !== status) {
      // Notify requester
      await createNotification({
        userId: request.requesterId,
        type: 'request_status_update',
        title: `Request ${status.toUpperCase()}`,
        message: `Administration has updated your inquiry status to '${status}'.`,
        entityId: request._id,
        entityType: 'Request'
      });

      // Notify artist
      const artist = await Artist.findById(request.artistId);
      if (artist) {
        await createNotification({
          userId: artist.userId,
          type: 'request_status_update',
          title: `Inquiry Status: ${status.toUpperCase()}`,
          message: `An inquiry assigned to you was updated to '${status}' by administration.`,
          entityId: request._id,
          entityType: 'Request'
        });
      }
    }

    const updatedRequest = await Request.findById(request._id)
      .populate('requesterId', 'name email phone avatar role')
      .populate('artistId', 'displayName location')
      .populate('artFormId', 'name slug');

    return sendSuccess(res, 'Request updated successfully', updatedRequest);
  } catch (error) {
    console.error('Error in updateRequest:', error);
    return sendError(res, 'Failed to update request', error.message, 500);
  }
};

module.exports = {
  getRequests,
  updateRequest
};
