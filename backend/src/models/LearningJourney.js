const mongoose = require('mongoose');

const LearningJourneySchema = new mongoose.Schema({
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
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner"
    },
    modules: [{
        title: { type: String, required: true },
        description: { type: String, default: "" },
        content: { type: String, default: "" },
        durationMinutes: { type: Number, default: 30 },
        mediaUrl: { type: String, default: "" }
    }],
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "published"
    }
}, { timestamps: true });

module.exports = mongoose.model("LearningJourney", LearningJourneySchema);
