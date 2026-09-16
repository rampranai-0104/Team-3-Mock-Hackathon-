const mongoose = require('mongoose');
const { ARTIST_VERIFICATION_STATUS, MEDIA_TYPES } = require('../constants');

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(MEDIA_TYPES),
      default: MEDIA_TYPES.IMAGE
    },
    title: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const artistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      trim: true,
      default: ''
    },
    artFormIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ArtForm'
      }
    ],
    location: {
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      country: { type: String, trim: true, default: 'India' }
    },
    languages: [
      {
        type: String,
        trim: true
      }
    ],
    experience: {
      type: Number, // Years of experience
      default: 0
    },
    media: [mediaSchema],
    verificationStatus: {
      type: String,
      enum: Object.values(ARTIST_VERIFICATION_STATUS),
      default: ARTIST_VERIFICATION_STATUS.PENDING,
      index: true
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: ''
    },
    availability: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      notes: {
        type: String,
        default: ''
      }
    }
  },
  {
    timestamps: true
  }
);

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
