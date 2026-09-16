const mongoose = require('mongoose');
const Event = require('../../models/Event');
const Artist = require('../../models/Artist');
const ArtForm = require('../../models/ArtForm');
const Booking = require('../../models/Booking');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { createNotification } = require('../../services/notificationService');
const { EVENT_STATUS, EVENT_TYPES } = require('../../constants');

/**
 * GET /api/admin/events
 * List and filter all events across the platform
 */
const getEvents = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status && Object.values(EVENT_STATUS).includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.type && Object.values(EVENT_TYPES).includes(req.query.type)) {
      query.type = req.query.type;
    }

    if (req.query.artistId && mongoose.Types.ObjectId.isValid(req.query.artistId)) {
      query.artistIds = req.query.artistId;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const totalEvents = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('artistIds', 'displayName location')
      .populate('artFormIds', 'name slug')
      .sort({ dateTime: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return sendSuccess(res, 'Events retrieved successfully', {
      totalEvents,
      page,
      limit,
      totalPages: Math.ceil(totalEvents / limit) || 1,
      events
    });
  } catch (error) {
    console.error('Error in getEvents:', error);
    return sendError(res, 'Failed to retrieve events', error.message, 500);
  }
};

/**
 * POST /api/admin/events
 * Create or directly publish an event with admin authorization
 */
const createEvent = async (req, res) => {
  try {
    const {
      title,
      type,
      artistIds,
      artFormIds,
      description,
      dateTime,
      durationMinutes,
      location,
      capacity,
      price,
      status
    } = req.body;

    const validationErrors = [];

    if (!title || typeof title !== 'string' || !title.trim()) {
      validationErrors.push({ field: 'title', message: 'Event title is required.' });
    }

    if (!dateTime || isNaN(new Date(dateTime).getTime())) {
      validationErrors.push({ field: 'dateTime', message: 'A valid event date and time is required.' });
    }

    const capNum = Number(capacity);
    if (isNaN(capNum) || capNum < 1) {
      validationErrors.push({ field: 'capacity', message: 'Capacity must be at least 1.' });
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      validationErrors.push({ field: 'price', message: 'Price must be a non-negative number.' });
    }

    if (type && !Object.values(EVENT_TYPES).includes(type)) {
      validationErrors.push({ field: 'type', message: `Invalid type. Allowed: ${Object.values(EVENT_TYPES).join(', ')}` });
    }

    if (status && !Object.values(EVENT_STATUS).includes(status)) {
      validationErrors.push({ field: 'status', message: `Invalid status. Allowed: ${Object.values(EVENT_STATUS).join(', ')}` });
    }

    if (!Array.isArray(artistIds) || artistIds.length === 0) {
      validationErrors.push({ field: 'artistIds', message: 'At least one valid artistId is required.' });
    } else {
      for (const aId of artistIds) {
        if (!mongoose.Types.ObjectId.isValid(aId)) {
          validationErrors.push({ field: 'artistIds', message: `Invalid artist ID format: ${aId}` });
        } else {
          const artistExists = await Artist.findById(aId);
          if (!artistExists) {
            validationErrors.push({ field: 'artistIds', message: `Referenced artist ${aId} does not exist.` });
          }
        }
      }
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    const event = await Event.create({
      title: title.trim(),
      type: type || EVENT_TYPES.WORKSHOP,
      artistIds,
      createdBy: req.user._id,
      artFormIds: Array.isArray(artFormIds) ? artFormIds : [],
      description: description ? description.trim() : '',
      dateTime: new Date(dateTime),
      durationMinutes: durationMinutes ? Number(durationMinutes) : 60,
      location: location || {},
      capacity: capNum,
      price: priceNum,
      status: status || EVENT_STATUS.PUBLISHED
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('artistIds', 'displayName location')
      .populate('artFormIds', 'name slug');

    return sendSuccess(res, 'Event created successfully', populatedEvent, 201);
  } catch (error) {
    console.error('Error in createEvent:', error);
    return sendError(res, 'Failed to create event', error.message, 500);
  }
};

/**
 * PATCH /api/admin/events/:id
 * Update any event details or moderation/status
 */
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid event ID format.', null, 400);
    }

    const event = await Event.findById(id);
    if (!event) {
      return sendError(res, 'Event not found.', null, 404);
    }

    const {
      title,
      type,
      artistIds,
      artFormIds,
      description,
      dateTime,
      durationMinutes,
      location,
      capacity,
      price,
      status
    } = req.body;

    const validationErrors = [];

    if (status && !Object.values(EVENT_STATUS).includes(status)) {
      validationErrors.push({ field: 'status', message: `Invalid status '${status}'.` });
    }

    if (capacity !== undefined) {
      const capNum = Number(capacity);
      if (isNaN(capNum) || capNum < event.bookedCount) {
        validationErrors.push({
          field: 'capacity',
          message: `Capacity cannot be lower than existing bookings (${event.bookedCount}).`
        });
      }
    }

    if (price !== undefined) {
      const priceNum = Number(price);
      if (isNaN(priceNum) || priceNum < 0) {
        validationErrors.push({ field: 'price', message: 'Price must be a non-negative number.' });
      }
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    if (title) event.title = title.trim();
    if (type) event.type = type;
    if (artistIds) event.artistIds = artistIds;
    if (artFormIds) event.artFormIds = artFormIds;
    if (description !== undefined) event.description = description.trim();
    if (dateTime) event.dateTime = new Date(dateTime);
    if (durationMinutes) event.durationMinutes = Number(durationMinutes);
    if (location) event.location = { ...event.location, ...location };
    if (capacity) event.capacity = Number(capacity);
    if (price !== undefined) event.price = Number(price);

    const oldStatus = event.status;
    if (status) event.status = status;

    await event.save();

    // If event was published or approved, notify participating artists
    if (oldStatus !== EVENT_STATUS.PUBLISHED && event.status === EVENT_STATUS.PUBLISHED) {
      for (const aId of event.artistIds) {
        const artistDoc = await Artist.findById(aId);
        if (artistDoc) {
          await createNotification({
            userId: artistDoc.userId,
            type: 'event_published',
            title: 'Event Published',
            message: `Your event "${event.title}" is now published and live for bookings.`,
            entityId: event._id,
            entityType: 'Event'
          });
        }
      }
    }

    const updatedEvent = await Event.findById(event._id)
      .populate('artistIds', 'displayName location')
      .populate('artFormIds', 'name slug');

    return sendSuccess(res, 'Event updated successfully', updatedEvent);
  } catch (error) {
    console.error('Error in updateEvent:', error);
    return sendError(res, 'Failed to update event', error.message, 500);
  }
};

/**
 * DELETE /api/admin/events/:id
 * Cancels or removes an event (checks for existing bookings)
 */
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid event ID format.', null, 400);
    }

    const event = await Event.findById(id);
    if (!event) {
      return sendError(res, 'Event not found.', null, 404);
    }

    const bookingCount = await Booking.countDocuments({
      eventId: id,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (bookingCount > 0) {
      // Event has bookings -> cancel rather than hard delete to protect booking records
      event.status = EVENT_STATUS.CANCELLED;
      await event.save();

      // Notify participating artists
      for (const aId of event.artistIds) {
        const artistDoc = await Artist.findById(aId);
        if (artistDoc) {
          await createNotification({
            userId: artistDoc.userId,
            type: 'event_cancelled',
            title: 'Event Cancelled',
            message: `Event "${event.title}" has been cancelled by administration.`,
            entityId: event._id,
            entityType: 'Event'
          });
        }
      }

      return sendSuccess(
        res,
        `Event has ${bookingCount} active bookings and was marked as cancelled (status: cancelled).`,
        { id: event._id, status: EVENT_STATUS.CANCELLED, activeBookings: bookingCount }
      );
    }

    // No bookings -> safe to remove
    await Event.findByIdAndDelete(id);
    return sendSuccess(res, 'Event deleted successfully', { id });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    return sendError(res, 'Failed to delete event', error.message, 500);
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
