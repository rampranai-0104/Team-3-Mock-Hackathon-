const express = require('express');

const {
    getExperiences,
    getExperienceById
} = require('../../controllers/institution/experienceController');

const route = express.Router();

route.get('/', getExperiences);
route.get('/:id', getExperienceById);

module.exports = route;
