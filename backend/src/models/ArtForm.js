const mongoose = require('mongoose');

const ArtFormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Art form name is required"],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    regions: [{
        type: String,
        trim: true
    }],
    history: {
        type: String,
        default: ""
    },
    techniques: [{
        type: String
    }],
    materials: [{
        type: String
    }],
    media: [{
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
        type: { type: String, default: "image" },
        caption: { type: String, default: "" }
    }],
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, { timestamps: true });

module.exports = mongoose.model("ArtForm", ArtFormSchema);
