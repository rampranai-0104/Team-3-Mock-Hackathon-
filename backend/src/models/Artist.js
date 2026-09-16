const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: [true, "Display name is required"],
        trim: true
    },
    bio: {
        type: String,
        default: ""
    },
    artFormIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArtForm"
    }],
    location: {
        state: { type: String, default: "" },
        city: { type: String, default: "" },
        country: { type: String, default: "India" }
    },
    languages: [{
        type: String
    }],
    experience: {
        type: Number,
        default: 0
    },
    profileImage: {
        type: String,
        default: ""
    },
    media: [{
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
        type: { type: String, default: "image" },
        caption: { type: String, default: "" }
    }],
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected", "suspended"],
        default: "pending"
    },
    availability: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Artist", ArtistSchema);
