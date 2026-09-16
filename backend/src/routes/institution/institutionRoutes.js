const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');

const {
    getMyInstitutionProfile,
    updateMyInstitutionProfile,
    getInstitutionBookings,
    getInstitutionOrders
} = require('../../controllers/institution/institutionController');

const route = express.Router();

route.get('/me', authMiddleware, getMyInstitutionProfile);
route.patch('/me', authMiddleware, updateMyInstitutionProfile);
route.put('/me', authMiddleware, updateMyInstitutionProfile);
route.get('/', authMiddleware, getMyInstitutionProfile);
route.patch('/', authMiddleware, updateMyInstitutionProfile);
route.put('/', authMiddleware, updateMyInstitutionProfile);
route.get('/me/bookings', authMiddleware, getInstitutionBookings);
route.get('/me/orders', authMiddleware, getInstitutionOrders);

module.exports = route;
