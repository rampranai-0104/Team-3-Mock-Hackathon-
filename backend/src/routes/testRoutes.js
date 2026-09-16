const express = require('express');
const { singleUpload } = require('../middleware/uploadMiddleware');
const { testUpload } = require('../controllers/testController');

const route = express.Router();

route.post('/upload', singleUpload('image'), testUpload);

module.exports = route;

