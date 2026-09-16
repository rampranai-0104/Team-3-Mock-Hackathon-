const express = require('express');

const { globalPublicSearch } = require('../../services/searchService');
const { sendSuccess, sendError } = require('../../utils/apiResponse');

const route = express.Router();

route.get('/', async (req, res) => {
    try {
        const { q, limit } = req.query;
        const results = await globalPublicSearch(q || '', { limit });
        return sendSuccess(res, 'Search completed successfully', results);
    } catch (error) {
        return sendError(res, error.message, 500);
    }
});

module.exports = route;
