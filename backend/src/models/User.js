const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"]
    },
    password: {
        type: String,
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["public", "institution", "artist", "admin"],
        default: "public"
    },
    accountStatus: {
        type: String,
        enum: ["pending", "active", "suspended"],
        default: "active"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    avatar: {
        type: String,
        default: ""
    },
    preferredLanguage: {
        type: String,
        default: "en"
    }
}, { timestamps: true });

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
