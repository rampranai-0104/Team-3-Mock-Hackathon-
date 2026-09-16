const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
} = require('../../controllers/institution/orderController');

const route = express.Router();

route.post('/', authMiddleware, createOrder);
route.get('/', authMiddleware, getMyOrders);
route.get('/:id', authMiddleware, getOrderById);
route.post('/:id/cancel', authMiddleware, cancelOrder);

module.exports = route;
