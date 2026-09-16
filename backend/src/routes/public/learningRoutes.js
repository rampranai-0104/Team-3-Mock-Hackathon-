const express = require('express');

const {
    getPublishedLearning,
    getLearningById
} = require('../../controllers/public/learningController');

const route = express.Router();

route.get('/', getPublishedLearning);
route.get('/:id', getLearningById);

module.exports = route;
