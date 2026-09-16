const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommunityPost",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: [true, "Comment text is required"],
        trim: true,
        maxlength: [1000, "Comment cannot exceed 1000 characters"]
    }
}, { timestamps: true });

CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ user: 1 });

module.exports = mongoose.model("Comment", CommentSchema);
