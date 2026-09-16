const mongoose = require('mongoose');

const InstitutionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    organizationName: {
        type: String,
        required: [true, "Organization name is required"],
        trim: true
    },
    type: {
        type: String,
        enum: ["school", "college", "corporate", "ngo", "other"],
        default: "school"
    },
    contactPerson: {
        name: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        designation: { type: String, default: "" }
    },
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
        country: { type: String, default: "India" }
    },
    website: {
        type: String,
        default: ""
    },
    preferredArtForms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArtForm"
    }],
    verificationStatus: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Institution", InstitutionSchema);

