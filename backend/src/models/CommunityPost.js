const mongoose = require('mongoose');

const CommunityPostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    authorType: {
        type: String,
        enum: ["public", "institution"],
        default: "public"
    },
    caption: {
        type: String,
        required: [true, "Caption is required"],
        trim: true
    },
    images: [{
        url: { type: String, required: true },
        publicId: { type: String, default: "" }
    }],
    hashtags: [{
        type: String,
        trim: true
    }],
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    artForm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArtForm"
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
    status: {
        type: String,
        enum: ["published", "hidden", "flagged"],
        default: "published"
    },
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

CommunityPostSchema.index({ author: 1 });
CommunityPostSchema.index({ event: 1 });
CommunityPostSchema.index({ artForm: 1 });
CommunityPostSchema.index({ hashtags: 1 });
CommunityPostSchema.index({ createdAt: -1 });
CommunityPostSchema.index({ status: 1 });

module.exports = mongoose.model("CommunityPost", CommunityPostSchema);
