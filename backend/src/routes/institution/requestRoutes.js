const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');

const {
    createRequest,
    getMyRequests,
    getRequestById,
    updateRequest,
    cancelRequest
} = require('../../controllers/institution/requestController');

const route = express.Router();

route.post('/', authMiddleware, createRequest);
route.get('/', authMiddleware, getMyRequests);
route.get('/:id', authMiddleware, getRequestById);
route.patch('/:id', authMiddleware, updateRequest);
route.post('/:id/cancel', authMiddleware, cancelRequest);

module.exports = route;
