const mongoose = require('mongoose');
const { KNOWLEDGE_STATUS, KNOWLEDGE_TYPES, MEDIA_TYPES } = require('../constants');

const knowledgeMediaSchema = new mongoose.Schema(
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
    title: {
      type: String,
      trim: true,
      default: ''
    },
    caption: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: true }
);

const knowledgeItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    type: {
      type: String,
      default: 'article'
    },
    artFormId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArtForm',
      index: true
    },
    artistIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
      }
    ],
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    summary: {
      type: String,
      trim: true,
      default: ''
    },
    media: [knowledgeMediaSchema],
    sources: [
      {
        type: String,
        trim: true
      }
    ],
    language: {
      type: String,
      trim: true,
      default: 'en'
    },
    status: {
      type: String,
      enum: Object.values(KNOWLEDGE_STATUS || { DRAFT: 'draft', REVIEW: 'review', PUBLISHED: 'published', ARCHIVED: 'archived' }),
      default: 'draft',
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

knowledgeItemSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
  }
  next();
});

const KnowledgeItem = mongoose.model('KnowledgeItem', knowledgeItemSchema);

module.exports = KnowledgeItem;
