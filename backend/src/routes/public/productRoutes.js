const express = require('express');

const {
    getApprovedProducts,
    getProductById
} = require('../../controllers/public/productController');

const route = express.Router();

route.get('/', getApprovedProducts);
route.get('/:id', getProductById);

module.exports = route;
