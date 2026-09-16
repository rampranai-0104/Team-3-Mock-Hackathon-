const express = require('express');

const {
    getUpcomingEvents,
    getEventById
} = require('../../controllers/public/eventController');

const route = express.Router();

route.get('/', getUpcomingEvents);
route.get('/:id', getEventById);

module.exports = route;
