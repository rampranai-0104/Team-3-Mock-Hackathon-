const mongoose = require('mongoose');
const Event = require('../../models/Event');
const Artist = require('../../models/Artist');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { EVENT_STATUS, EVENT_TYPES } = require('../../constants');

/**
 * GET /api/artists/me/events
 * Returns events belonging to or featuring the authenticated artist
 */
const getEvents = async (req, res) => {
  try {
    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const events = await Event.find({
      $or: [{ artistIds: artist._id }, { createdBy: req.user._id }]
    })
      .populate('artFormIds', 'name slug')
      .sort({ dateTime: 1 })
      .lean();

    return sendSuccess(res, 'Artist events retrieved successfully', events);
  } catch (error) {
    console.error('Error in getEvents:', error);
    return sendError(res, 'Failed to retrieve events', error.message, 500);
  }
};

/**
 * POST /api/artists/me/events
 * Create an event proposal/draft by the authenticated artist
 */
const createEvent = async (req, res) => {
  try {
    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const {
      title,
      type,
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
      validationErrors.push({ field: 'title', message: 'Title is required.' });
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
      validationErrors.push({
        field: 'type',
        message: `Invalid type. Allowed types: ${Object.values(EVENT_TYPES).join(', ')}`
      });
    }

    // Direct publishing by artist is prohibited (requires admin review/approval)
    if (status === EVENT_STATUS.PUBLISHED) {
      validationErrors.push({
        field: 'status',
        message: 'Direct publishing is restricted. Submit with status "draft" or "pending_approval" for admin review.'
      });
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    const initialStatus = status === EVENT_STATUS.PENDING_APPROVAL
      ? EVENT_STATUS.PENDING_APPROVAL
      : EVENT_STATUS.DRAFT;

    const event = await Event.create({
      title: title.trim(),
      type: type || EVENT_TYPES.WORKSHOP,
      artistIds: [artist._id],
      createdBy: req.user._id,
      artFormIds: Array.isArray(artFormIds) ? artFormIds : [],
      description: description ? description.trim() : '',
      dateTime: new Date(dateTime),
      durationMinutes: durationMinutes ? Number(durationMinutes) : 60,
      location: location || {},
      capacity: capNum,
      price: priceNum,
      status: initialStatus
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('artFormIds', 'name slug')
      .populate('artistIds', 'displayName location');

    return sendSuccess(res, 'Event created successfully', populatedEvent, 201);
  } catch (error) {
    console.error('Error in createEvent:', error);
    return sendError(res, 'Failed to create event', error.message, 500);
  }
};

/**
 * PATCH /api/artists/me/events/:id
 * Update an event owned by the authenticated artist
 */
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid event ID format.', null, 400);
    }

    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const event = await Event.findOne({
      _id: id,
      $or: [{ artistIds: artist._id }, { createdBy: req.user._id }]
    });

    if (!event) {
      return sendError(res, 'Event not found or not owned by you.', null, 404);
    }

    const {
      title,
      type,
      artFormIds,
      description,
      dateTime,
      durationMinutes,
      location,
      capacity,
      price,
      status,
      bookedCount
    } = req.body;

    const validationErrors = [];

    // Disallow modifying protected fields
    if (bookedCount !== undefined && bookedCount !== event.bookedCount) {
      validationErrors.push({ field: 'bookedCount', message: 'Directly altering bookedCount is prohibited.' });
    }

    // Status transition controls
    if (status) {
      if (!Object.values(EVENT_STATUS).includes(status)) {
        validationErrors.push({ field: 'status', message: `Invalid status '${status}'.` });
      } else if (status === EVENT_STATUS.PUBLISHED && event.status !== EVENT_STATUS.PUBLISHED) {
        validationErrors.push({
          field: 'status',
          message: 'Direct publishing is restricted. Artists must submit for approval (pending_approval).'
        });
      }
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

    // Apply valid updates
    if (title) event.title = title.trim();
    if (type) event.type = type;
    if (artFormIds) event.artFormIds = artFormIds;
    if (description !== undefined) event.description = description.trim();
    if (dateTime) event.dateTime = new Date(dateTime);
    if (durationMinutes) event.durationMinutes = Number(durationMinutes);
    if (location) event.location = { ...event.location, ...location };
    if (capacity) event.capacity = Number(capacity);
    if (price !== undefined) event.price = Number(price);
    if (status) event.status = status;

    await event.save();

    const updatedEvent = await Event.findById(event._id)
      .populate('artFormIds', 'name slug')
      .populate('artistIds', 'displayName location');

    return sendSuccess(res, 'Event updated successfully', updatedEvent);
  } catch (error) {
    console.error('Error in updateEvent:', error);
    return sendError(res, 'Failed to update event', error.message, 500);
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent
};
