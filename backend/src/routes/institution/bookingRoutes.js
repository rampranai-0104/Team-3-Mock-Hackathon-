const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');

const {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking
} = require('../../controllers/institution/bookingController');

const route = express.Router();

route.post('/', authMiddleware, createBooking);
route.get('/', authMiddleware, getMyBookings);
route.get('/:id', authMiddleware, getBookingById);
route.post('/:id/cancel', authMiddleware, cancelBooking);

module.exports = route;
