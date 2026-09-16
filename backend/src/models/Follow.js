const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
        required: [true, "Artist is required"]
    }
}, { timestamps: true });

FollowSchema.index({ userId: 1, artistId: 1 }, { unique: true });

module.exports = mongoose.model("Follow", FollowSchema);
