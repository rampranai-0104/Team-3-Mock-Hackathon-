const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');

const {
    getMyActivity
} = require('../../controllers/public/activityController');

const route = express.Router();

route.get('/', authMiddleware, getMyActivity);
route.get('/activity', authMiddleware, getMyActivity);

module.exports = route;
