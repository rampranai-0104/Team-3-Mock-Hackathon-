const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    bookingCode: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    institutionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution"
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: [true, "Event is required"]
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    amount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["pending_payment", "confirmed", "cancelled", "completed", "no_show"],
        default: "confirmed"
    },
    notes: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);

