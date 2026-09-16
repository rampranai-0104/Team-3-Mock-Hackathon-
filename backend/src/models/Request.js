const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    requesterType: {
        type: String,
        enum: ["individual", "institution"],
        default: "institution"
    },
    institutionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution"
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist"
    },
    artFormId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArtForm"
    },
    title: {
        type: String,
        required: [true, "Request title is required"],
        trim: true
    },
    eventType: {
        type: String,
        enum: ["workshop", "performance", "masterclass", "custom"],
        default: "workshop"
    },
    groupSize: {
        type: Number,
        default: 20
    },
    preferredDate: {
        type: Date,
        required: [true, "Preferred date is required"]
    },
    alternateDate: {
        type: Date
    },
    budget: {
        type: Number,
        default: 0
    },
    location: {
        venue: { type: String, default: "" },
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        isOnline: { type: Boolean, default: false }
    },
    message: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
        default: "pending"
    },
    cancellationReason: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Request", RequestSchema);

