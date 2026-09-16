const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    institutionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution"
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1, min: 1 },
        image: { type: String, default: "" }
    }],
    subtotal: {
        type: Number,
        default: 0
    },
    shipping: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    shippingAddress: {
        name: { type: String, default: "" },
        phone: { type: String, default: "" },
        addressLine1: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" }
    },
    status: {
        type: String,
        enum: ["created", "paid", "processing", "shipped", "delivered", "cancelled"],
        default: "created"
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);

