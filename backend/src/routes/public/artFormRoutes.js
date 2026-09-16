const express = require('express');

const {
    getAllArtForms,
    getArtFormById
} = require('../../controllers/public/artFormController');

const route = express.Router();

route.get('/', getAllArtForms);
route.get('/:id', getArtFormById);

module.exports = route;
