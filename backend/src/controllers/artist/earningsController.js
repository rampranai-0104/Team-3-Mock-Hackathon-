const Artist = require('../../models/Artist');
const Booking = require('../../models/Booking');
const Order = require('../../models/Order');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const { BOOKING_STATUS, ORDER_STATUS } = require('../../constants');

/**
 * GET /api/artists/me/earnings
 * Aggregates financial earnings from confirmed bookings and completed product orders
 */
const getEarnings = async (req, res) => {
  try {
    const artist = await Artist.findOne({ userId: req.user._id });
    if (!artist) {
      return sendError(res, 'Artist profile not found.', null, 404);
    }

    const artistId = artist._id;

    // 1. Aggregate Booking Earnings
    const bookingSummary = await Booking.aggregate([
      { $match: { artistId } },
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    let bookingPaid = 0;
    let bookingPending = 0;

    bookingSummary.forEach((item) => {
      if (item._id === BOOKING_STATUS.CONFIRMED || item._id === BOOKING_STATUS.COMPLETED) {
        bookingPaid += item.totalAmount;
      } else if (item._id === BOOKING_STATUS.PENDING) {
        bookingPending += item.totalAmount;
      }
    });

    // 2. Aggregate Product Sales Earnings from Orders
    const productSummary = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.artistId': artistId } },
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          count: { $sum: 1 }
        }
      }
    ]);

    let productPaid = 0;
    let productPending = 0;

    productSummary.forEach((item) => {
      if (
        item._id === ORDER_STATUS.PAID ||
        item._id === ORDER_STATUS.SHIPPED ||
        item._id === ORDER_STATUS.DELIVERED
      ) {
        productPaid += item.totalAmount;
      } else if (item._id === ORDER_STATUS.PENDING) {
        productPending += item.totalAmount;
      }
    });

    const totalEarnings = bookingPaid + productPaid;
    const pendingEarnings = bookingPending + productPending;

    // 3. Fetch recent transaction history (last 20 items)
    const recentBookings = await Booking.find({
      artistId,
      status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED, BOOKING_STATUS.PENDING] }
    })
      .populate('eventId', 'title')
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const recentOrders = await Order.find({
      'items.artistId': artistId,
      status: { $in: [ORDER_STATUS.PAID, ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED, ORDER_STATUS.PENDING] }
    })
      .populate('buyerId', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Map into a normalized transaction list
    const transactions = [];

    recentBookings.forEach((b) => {
      transactions.push({
        id: b._id,
        type: 'booking',
        title: b.eventId?.title || 'Workshop / Experience Booking',
        customerName: b.userId?.name || 'Customer',
        amount: b.amount,
        status: b.status,
        date: b.createdAt
      });
    });

    recentOrders.forEach((o) => {
      // Find items relevant to this artist
      const artistItems = o.items.filter(
        (i) => i.artistId && i.artistId.toString() === artistId.toString()
      );
      artistItems.forEach((item) => {
        transactions.push({
          id: item._id,
          orderId: o._id,
          type: 'product_sale',
          title: item.title || 'Handcrafted Art Product',
          customerName: o.buyerId?.name || 'Buyer',
          amount: item.price * item.quantity,
          status: o.status,
          date: o.createdAt
        });
      });
    });

    // Sort combined transactions newest first
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    return sendSuccess(res, 'Earnings summary retrieved successfully', {
      totalEarnings,
      completedEarnings: totalEarnings,
      pendingEarnings,
      breakdown: {
        bookings: {
          paid: bookingPaid,
          pending: bookingPending
        },
        products: {
          paid: productPaid,
          pending: productPending
        }
      },
      transactions: transactions.slice(0, 20)
    });
  } catch (error) {
    console.error('Error in getEarnings:', error);
    return sendError(res, 'Failed to calculate earnings', error.message, 500);
  }
};

module.exports = {
  getEarnings
};
