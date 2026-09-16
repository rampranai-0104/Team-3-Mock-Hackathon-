const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Event title is required"],
        trim: true
    },
    type: {
        type: String,
        enum: ["workshop", "performance", "masterclass", "exhibition", "learning"],
        default: "workshop"
    },
    artistIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist"
    }],
    artFormIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArtForm"
    }],
    description: {
        type: String,
        required: [true, "Event description is required"],
        trim: true
    },
    date: {
        type: Date,
        required: [true, "Event date is required"]
    },
    time: {
        type: String,
        default: ""
    },
    location: {
        venue: { type: String, default: "" },
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        isOnline: { type: Boolean, default: false },
        meetingLink: { type: String, default: "" }
    },
    capacity: {
        type: Number,
        default: 50
    },
    availableSeats: {
        type: Number,
        default: 50
    },
    price: {
        type: Number,
        default: 0
    },
    image: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" }
    },
    status: {
        type: String,
        enum: ["draft", "pending_approval", "published", "ongoing", "completed", "cancelled"],
        default: "published"
    }
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
