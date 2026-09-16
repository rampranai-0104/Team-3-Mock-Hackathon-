const mongoose = require('mongoose');

const artFormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Art form name is required'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    regions: [{
      type: String,
      trim: true
    }],
    history: {
      type: String,
      default: ''
    },
    techniques: [{
      type: String
    }],
    materials: [{
      type: String
    }],
    media: [{
      url: { type: String, required: true },
      publicId: { type: String, default: '' },
      type: { type: String, default: 'image' },
      caption: { type: String, default: '' }
    }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

const ArtForm = mongoose.model('ArtForm', artFormSchema);

module.exports = ArtForm;
