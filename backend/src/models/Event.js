const mongoose = require('mongoose');
const { EVENT_STATUS, EVENT_TYPES } = require('../constants');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(EVENT_TYPES),
      default: EVENT_TYPES.WORKSHOP
    },
    artistIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
        index: true
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    artFormIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ArtForm'
      }
    ],
    description: {
      type: String,
      trim: true,
      default: ''
    },
    dateTime: {
      type: Date,
      required: true
    },
    durationMinutes: {
      type: Number,
      default: 60
    },
    location: {
      isOnline: { type: Boolean, default: false },
      address: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      meetingLink: { type: String, trim: true, default: '' }
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      default: 20
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    media: [
      {
        url: String,
        publicId: String,
        type: { type: String, default: 'image' }
      }
    ],
    status: {
      type: String,
      enum: Object.values(EVENT_STATUS),
      default: EVENT_STATUS.DRAFT,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
