const User = require('../models/User');
const Artist = require('../models/Artist');
const ArtForm = require('../models/ArtForm');
const Event = require('../models/Event');
const Product = require('../models/Product');
const Booking = require('../models/Booking');
const Order = require('../models/Order');
const Follow = require('../models/Follow');
const Request = require('../models/Request');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const { BOOKING_STATUS, ORDER_STATUS, ARTIST_VERIFICATION_STATUS } = require('../constants');

/**
 * Returns overall dashboard KPIs using efficient counts and aggregations
 */
const getDashboardKPIs = async () => {
  const [
    totalUsers,
    totalArtists,
    pendingArtists,
    totalArtForms,
    totalEvents,
    totalBookings,
    totalOrders
  ] = await Promise.all([
    User.countDocuments(),
    Artist.countDocuments(),
    Artist.countDocuments({ verificationStatus: ARTIST_VERIFICATION_STATUS.PENDING }),
    ArtForm.countDocuments(),
    Event.countDocuments(),
    Booking.countDocuments(),
    Order.countDocuments()
  ]);

  return {
    users: totalUsers,
    artists: totalArtists,
    pendingArtistVerifications: pendingArtists,
    artForms: totalArtForms,
    events: totalEvents,
    bookings: totalBookings,
    orders: totalOrders
  };
};

/**
 * Platform overview analytics
 */
const getPlatformOverview = async () => {
  const [
    userRoleBreakdown,
    artistStatusBreakdown,
    bookingRevenueAgg,
    orderRevenueAgg
  ] = await Promise.all([
    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]),
    Artist.aggregate([
      { $group: { _id: '$verificationStatus', count: { $sum: 1 } } }
    ]),
    Booking.aggregate([
      { $match: { status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED] } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]),
    Order.aggregate([
      { $match: { status: { $in: [ORDER_STATUS.PAID, ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED] } } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
    ])
  ]);

  const bookingRevenue = bookingRevenueAgg[0]?.total || 0;
  const orderRevenue = orderRevenueAgg[0]?.total || 0;

  return {
    usersByRole: Object.fromEntries(userRoleBreakdown.map(r => [r._id, r.count])),
    artistsByStatus: Object.fromEntries(artistStatusBreakdown.map(s => [s._id, s.count])),
    financials: {
      bookingRevenue,
      productRevenue: orderRevenue,
      totalRevenue: bookingRevenue + orderRevenue
    }
  };
};

/**
 * Artist analytics
 */
const getArtistAnalytics = async () => {
  const [statusStats, topEarnersAgg, totalArtists] = await Promise.all([
    Artist.aggregate([
      { $group: { _id: '$verificationStatus', count: { $sum: 1 } } }
    ]),
    Booking.aggregate([
      { $match: { status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED] } } },
      { $group: { _id: '$artistId', totalEarned: { $sum: '$amount' }, bookingsCount: { $sum: 1 } } },
      { $sort: { totalEarned: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'artists',
          localField: '_id',
          foreignField: '_id',
          as: 'artist'
        }
      },
      { $unwind: '$artist' },
      {
        $project: {
          artistId: '$_id',
          displayName: '$artist.displayName',
          totalEarned: 1,
          bookingsCount: 1
        }
      }
    ]),
    Artist.countDocuments()
  ]);

  return {
    totalArtists,
    statusBreakdown: Object.fromEntries(statusStats.map(s => [s._id, s.count])),
    topEarners: topEarnersAgg
  };
};

/**
 * Art form analytics
 */
const getArtFormAnalytics = async () => {
  const [artForms, artistDistribution, productDistribution] = await Promise.all([
    ArtForm.find().select('name slug status').lean(),
    Artist.aggregate([
      { $unwind: '$artFormIds' },
      { $group: { _id: '$artFormIds', artistCount: { $sum: 1 } } }
    ]),
    Product.aggregate([
      { $group: { _id: '$artFormId', productCount: { $sum: 1 } } }
    ])
  ]);

  const artistMap = Object.fromEntries(artistDistribution.map(a => [a._id.toString(), a.artistCount]));
  const productMap = Object.fromEntries(productDistribution.map(p => [p._id.toString(), p.productCount]));

  const summary = artForms.map(af => ({
    id: af._id,
    name: af.name,
    slug: af.slug,
    status: af.status,
    artistCount: artistMap[af._id.toString()] || 0,
    productCount: productMap[af._id.toString()] || 0
  }));

  return {
    totalArtForms: artForms.length,
    artForms: summary
  };
};

/**
 * Engagement analytics
 */
const getEngagementAnalytics = async () => {
  const [totalFollows, requestStats, eventTypesAgg] = await Promise.all([
    Follow.countDocuments(),
    Request.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Event.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ])
  ]);

  return {
    totalFollows,
    requestsByStatus: Object.fromEntries(requestStats.map(r => [r._id, r.count])),
    eventsByType: Object.fromEntries(eventTypesAgg.map(e => [e._id, e.count]))
  };
};

/**
 * Revenue analytics
 */
const getRevenueAnalytics = async () => {
  const [bookingRev, productRev] = await Promise.all([
    Booking.aggregate([
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]),
    Order.aggregate([
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$total' },
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  let bookingPaid = 0;
  let bookingPending = 0;
  bookingRev.forEach(b => {
    if (b._id === BOOKING_STATUS.CONFIRMED || b._id === BOOKING_STATUS.COMPLETED) {
      bookingPaid += b.totalAmount;
    } else if (b._id === BOOKING_STATUS.PENDING) {
      bookingPending += b.totalAmount;
    }
  });

  let productPaid = 0;
  let productPending = 0;
  productRev.forEach(p => {
    if (p._id === ORDER_STATUS.PAID || p._id === ORDER_STATUS.SHIPPED || p._id === ORDER_STATUS.DELIVERED) {
      productPaid += p.totalAmount;
    } else if (p._id === ORDER_STATUS.PENDING) {
      productPending += p.totalAmount;
    }
  });

  return {
    totalRevenue: bookingPaid + productPaid,
    pendingRevenue: bookingPending + productPending,
    breakdown: {
      bookings: {
        paid: bookingPaid,
        pending: bookingPending,
        details: bookingRev
      },
      products: {
        paid: productPaid,
        pending: productPending,
        details: productRev
      }
    }
  };
};

module.exports = {
  getDashboardKPIs,
  getPlatformOverview,
  getArtistAnalytics,
  getArtFormAnalytics,
  getEngagementAnalytics,
  getRevenueAnalytics
};
