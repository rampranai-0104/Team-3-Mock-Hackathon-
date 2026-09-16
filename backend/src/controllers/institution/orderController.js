const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Institution = require("../../models/Institution");
const generateOrderNumber = require("../../utils/generateOrderNumber");

const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one item"
            });
        }

        const orderItems = [];
        let subtotal = 0;

        const mongoose = require('mongoose');
        for (const item of items) {
            let product = null;
            if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
                product = await Product.findById(item.productId);
            }
            if (!product && item.title) {
                product = await Product.findOne({
                    $or: [
                        { title: new RegExp(item.title, 'i') },
                        { name: new RegExp(item.title, 'i') }
                    ]
                });
            }
            if (!product) {
                product = await Product.findOne();
            }

            const quantity = parseInt(item.quantity, 10) || 1;
            const itemPrice = item.price !== undefined ? Number(item.price) : (product ? product.price : 1000);
            const itemTitle = item.title || (product ? (product.title || product.name) : 'Handcrafted Artwork');
            const itemImage = item.image || (product && product.images && product.images.length ? product.images[0].url : '');

            orderItems.push({
                productId: product ? product._id : new mongoose.Types.ObjectId(),
                artistId: product ? product.artistId : null,
                title: itemTitle,
                name: itemTitle,
                price: itemPrice,
                quantity,
                image: itemImage
            });

            subtotal += itemPrice * quantity;

            // Decrement stock if valid product found
            if (product && product.stock >= quantity) {
                product.stock -= quantity;
                await product.save();
            }
        }

        let institutionId = null;
        const institution = await Institution.findOne({ userId: req.user._id });
        if (institution) {
            institutionId = institution._id;
        }

        const orderNumber = generateOrderNumber();
        const shipping = 0; // Standard free shipping for collection orders
        const total = subtotal + shipping;

        const order = await Order.create({
            orderNumber,
            buyerId: req.user._id,
            institutionId,
            items: orderItems,
            subtotal,
            shipping,
            total,
            shippingAddress: shippingAddress || {},
            status: "created"
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyerId: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            buyerId: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order details fetched successfully",
            data: order
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            buyerId: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.status === "shipped" || order.status === "delivered" || order.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order with status '${order.status}'`
            });
        }

        order.status = "cancelled";
        await order.save();

        // Restore stock
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
};

