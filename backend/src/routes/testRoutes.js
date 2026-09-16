const express = require('express');
const { uploadSingleImage } = require('../middleware/uploadMiddleware');
const { testUpload } = require('../controllers/testController');

const route = express.Router();

route.post('/upload', uploadSingleImage('image'), testUpload);

module.exports = route;

