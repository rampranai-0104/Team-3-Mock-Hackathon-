const mongoose = require('mongoose');
const { REQUEST_STATUS } = require('../constants');

const requestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    requesterType: {
      type: String,
      default: 'public'
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution'
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
      index: true
    },
    artFormId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArtForm'
    },
    title: {
      type: String,
      trim: true,
      default: ''
    },
    eventType: {
      type: String,
      trim: true,
      default: 'workshop'
    },
    groupSize: {
      type: Number,
      min: 1,
      default: 1
    },
    preferredDate: {
      type: Date,
      required: true
    },
    alternateDate: {
      type: Date
    },
    location: {
      venue: { type: String, default: '' },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      isOnline: { type: Boolean, default: false }
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    budget: {
      type: Number,
      min: 0,
      default: 0
    },
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS || {
        PENDING: 'pending',
        ACCEPTED: 'accepted',
        REJECTED: 'rejected',
        CANCELLED: 'cancelled',
        COMPLETED: 'completed'
      }),
      default: 'pending',
      index: true
    },
    cancellationReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
