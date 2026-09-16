const mongoose = require('mongoose');
const { PRODUCT_STATUS, PRODUCT_MODERATION_STATUS, MEDIA_TYPES } = require('../constants');

const productMediaSchema = new mongoose.Schema(
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
    isPrimary: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
      index: true
    },
    artFormId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArtForm',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },
    media: [productMediaSchema],
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.DRAFT,
      index: true
    },
    moderationStatus: {
      type: String,
      enum: Object.values(PRODUCT_MODERATION_STATUS),
      default: PRODUCT_MODERATION_STATUS.DRAFT,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
