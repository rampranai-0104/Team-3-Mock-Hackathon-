const express = require('express');

const {
    getPublishedKnowledge,
    getKnowledgeById
} = require('../../controllers/public/knowledgeController');

const route = express.Router();

route.get('/', getPublishedKnowledge);
route.get('/:id', getKnowledgeById);

module.exports = route;
