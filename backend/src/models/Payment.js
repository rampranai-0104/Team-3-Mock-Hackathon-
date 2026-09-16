const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
    },
    amount: {
        type: Number,
        required: [true, "Payment amount is required"]
    },
    currency: {
        type: String,
        default: "INR"
    },
    razorpayOrderId: {
        type: String,
        default: ""
    },
    razorpayPaymentId: {
        type: String,
        default: ""
    },
    razorpaySignature: {
        type: String,
        default: ""
    },
    paymentMethod: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["created", "authorized", "captured", "failed", "refunded"],
        default: "created"
    }
}, { timestamps: true });

PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ razorpayOrderId: 1 });
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ bookingId: 1 });

module.exports = mongoose.model("Payment", PaymentSchema);

