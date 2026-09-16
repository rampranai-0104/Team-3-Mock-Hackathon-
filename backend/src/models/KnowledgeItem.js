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
      required: true
    },
    type: {
      type: String,
      enum: Object.values(MEDIA_TYPES),
      default: MEDIA_TYPES.IMAGE
    },
    title: {
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
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(KNOWLEDGE_TYPES),
      default: KNOWLEDGE_TYPES.ARTICLE
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
      required: true
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
      enum: Object.values(KNOWLEDGE_STATUS),
      default: KNOWLEDGE_STATUS.DRAFT,
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

const KnowledgeItem = mongoose.model('KnowledgeItem', knowledgeItemSchema);

module.exports = KnowledgeItem;
