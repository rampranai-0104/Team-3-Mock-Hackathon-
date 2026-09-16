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
      enum: ['public', 'institution'],
      default: 'public'
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
    message: {
      type: String,
      trim: true,
      default: ''
    },
    budget: {
      type: Number,
      min: 0
    },
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.PENDING,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
