const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: [true, 'Artist is required'],
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index to prevent duplicate follows
followSchema.index({ userId: 1, artistId: 1 }, { unique: true });

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
