const mongoose = require('mongoose');

const artFormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      trim: true
    },
    regions: [{
      type: String,
      trim: true
    }],
    history: {
      type: String
    },
    techniques: [{
      type: String
    }],
    materials: [{
      type: String
    }],
    media: [{
      url: String,
      publicId: String,
      type: {
        type: String,
        default: 'image'
      }
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
