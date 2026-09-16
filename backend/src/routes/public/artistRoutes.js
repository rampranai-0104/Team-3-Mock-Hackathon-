const express = require('express');

const {
    getApprovedArtists,
    getArtistById
} = require('../../controllers/public/artistController');

const route = express.Router();

route.get('/', getApprovedArtists);
route.get('/:id', getArtistById);

module.exports = route;
