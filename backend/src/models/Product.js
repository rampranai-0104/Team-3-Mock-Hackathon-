const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
        required: [true, "Artist is required"]
    },
    artFormId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArtForm",
        required: [true, "Art form is required"]
    },
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
    },
    images: [{
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
        isPrimary: { type: Boolean, default: false }
    }],
    stock: {
        type: Number,
        default: 1,
        min: 0
    },
    category: {
        type: String,
        enum: ["painting", "sculpture", "textile", "craft", "jewelry", "other"],
        default: "painting"
    },
    status: {
        type: String,
        enum: ["draft", "pending_review", "approved", "rejected", "archived"],
        default: "approved"
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
