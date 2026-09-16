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
      default: ''
    },
    type: {
      type: String,
      enum: Object.values(MEDIA_TYPES || { IMAGE: 'image', VIDEO: 'video', AUDIO: 'audio', DOCUMENT: 'document' }),
      default: 'image'
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
      required: [true, 'Artist is required'],
      index: true
    },
    artFormId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArtForm',
      required: [true, 'Art form is required'],
      index: true
    },
    title: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },
    category: {
      type: String,
      default: 'painting'
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false }
      }
    ],
    media: [productMediaSchema],
    status: {
      type: String,
      default: 'draft',
      index: true
    },
    moderationStatus: {
      type: String,
      enum: Object.values(PRODUCT_MODERATION_STATUS || {
        DRAFT: 'draft',
        PENDING_REVIEW: 'pending_review',
        APPROVED: 'approved',
        REJECTED: 'rejected',
        ARCHIVED: 'archived'
      }),
      default: 'draft',
      index: true
    }
  },
  {
    timestamps: true
  }
);

productSchema.pre('save', function (next) {
  if (this.name && !this.title) this.title = this.name;
  if (this.title && !this.name) this.name = this.title;
  if (this.images && this.images.length > 0 && (!this.media || this.media.length === 0)) {
    this.media = this.images.map(img => ({
      url: img.url,
      publicId: img.publicId,
      isPrimary: img.isPrimary,
      type: 'image'
    }));
  } else if (this.media && this.media.length > 0 && (!this.images || this.images.length === 0)) {
    this.images = this.media.map(m => ({
      url: m.url,
      publicId: m.publicId,
      isPrimary: m.isPrimary
    }));
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
