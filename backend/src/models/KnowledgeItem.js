const mongoose = require('mongoose');

const KnowledgeItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    artFormId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArtForm",
        required: [true, "Art form is required"]
    },
    artistIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist"
    }],
    type: {
        type: String,
        enum: ["history", "tradition", "technique", "material", "story", "lineage"],
        default: "history"
    },
    content: {
        type: String,
        required: [true, "Content is required"]
    },
    summary: {
        type: String,
        default: ""
    },
    media: [{
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
        type: { type: String, default: "image" },
        caption: { type: String, default: "" }
    }],
    sources: [{
        type: String
    }],
    language: {
        type: String,
        default: "English"
    },
    status: {
        type: String,
        enum: ["draft", "review", "published", "archived"],
        default: "published"
    }
}, { timestamps: true });

module.exports = mongoose.model("KnowledgeItem", KnowledgeItemSchema);
