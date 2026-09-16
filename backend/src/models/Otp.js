const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true
    },
    otp: {
      type: String,
      required: [true, 'OTP is required'],
      trim: true
    },
    purpose: {
      type: String,
      enum: ['verification', 'registration', 'login', 'password_reset', 'profile_update'],
      default: 'verification',
      index: true
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0
    },
    isConsumed: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // TTL index automatically deletes document once expiresAt is reached
    }
  },
  {
    timestamps: true
  }
);

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
