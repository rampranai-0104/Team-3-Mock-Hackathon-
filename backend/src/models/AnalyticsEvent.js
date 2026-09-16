const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    eventType: {
      type: String,
      required: true,
      index: true
    },
    entityType: {
      type: String,
      index: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);

module.exports = AnalyticsEvent;
