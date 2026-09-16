const mongoose = require('mongoose');

const PostLikeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommunityPost",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

PostLikeSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("PostLike", PostLikeSchema);
