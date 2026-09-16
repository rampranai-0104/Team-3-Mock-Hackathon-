const mongoose = require('mongoose');
const Booking = require('../../models/Booking');
const Payment = require('../../models/Payment');
const Artist = require('../../models/Artist');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { createNotification } = require('../../services/notificationService');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../../constants');

/**
 * GET /api/admin/bookings
 * List all bookings across the platform with filtering and pagination
 */
const getBookings = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status && Object.values(BOOKING_STATUS).includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.artistId && mongoose.Types.ObjectId.isValid(req.query.artistId)) {
      query.artistId = req.query.artistId;
    }

    if (req.query.eventId && mongoose.Types.ObjectId.isValid(req.query.eventId)) {
      query.eventId = req.query.eventId;
    }

    if (req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId)) {
      query.userId = req.query.userId;
    }

    if (req.query.bookingCode) {
      query.bookingCode = new RegExp(req.query.bookingCode.trim(), 'i');
    }

    const totalBookings = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone avatar')
      .populate('artistId', 'displayName location')
      .populate('eventId', 'title dateTime location price')
      .populate('paymentId', 'amount currency status provider')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return sendSuccess(res, 'Bookings retrieved successfully', {
      totalBookings,
      page,
      limit,
      totalPages: Math.ceil(totalBookings / limit) || 1,
      bookings
    });
  } catch (error) {
    console.error('Error in getBookings:', error);
    return sendError(res, 'Failed to retrieve bookings', error.message, 500);
  }
};

/**
 * PATCH /api/admin/bookings/:id
 * Admin updates booking status and manages refund status synchronization
 */
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid booking ID format.', null, 400);
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return sendError(res, 'Booking not found.', null, 404);
    }

    const { status } = req.body;
    const validationErrors = [];

    if (!status || !Object.values(BOOKING_STATUS).includes(status)) {
      validationErrors.push({
        field: 'status',
        message: `Invalid status. Allowed: ${Object.values(BOOKING_STATUS).join(', ')}`
      });
    }

    if (validationErrors.length > 0) {
      return sendError(res, 'Validation failed', validationErrors, 400);
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    // If status transitioned to refunded and a payment record is associated, update payment record
    if (status === BOOKING_STATUS.REFUNDED && booking.paymentId) {
      await Payment.findByIdAndUpdate(booking.paymentId, { status: PAYMENT_STATUS.REFUNDED });
    }

    // Dispatch notifications to customer and artist on status changes
    if (oldStatus !== status) {
      await createNotification({
        userId: booking.userId,
        type: 'booking_status_update',
        title: `Booking Update: ${status.toUpperCase()}`,
        message: `Your booking (${booking.bookingCode}) status is now '${status}'.`,
        entityId: booking._id,
        entityType: 'Booking'
      });

      const artist = await Artist.findById(booking.artistId);
      if (artist) {
        await createNotification({
          userId: artist.userId,
          type: 'booking_status_update',
          title: `Booking Update: ${status.toUpperCase()}`,
          message: `Booking (${booking.bookingCode}) for your experience is now '${status}'.`,
          entityId: booking._id,
          entityType: 'Booking'
        });
      }
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email phone avatar')
      .populate('artistId', 'displayName location')
      .populate('eventId', 'title dateTime location price')
      .populate('paymentId', 'amount currency status provider');

    return sendSuccess(res, 'Booking updated successfully', updatedBooking);
  } catch (error) {
    console.error('Error in updateBooking:', error);
    return sendError(res, 'Failed to update booking', error.message, 500);
  }
};

module.exports = {
  getBookings,
  updateBooking
};
