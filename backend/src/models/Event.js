const mongoose = require('mongoose');
const { EVENT_STATUS, EVENT_TYPES } = require('../constants');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(EVENT_TYPES || { WORKSHOP: 'workshop', PERFORMANCE: 'performance', MASTERCLASS: 'masterclass', EXHIBITION: 'exhibition', LEARNING: 'learning' }),
      default: 'workshop'
    },
    artistIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        index: true
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    artFormIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ArtForm'
      }
    ],
    description: {
      type: String,
      trim: true,
      default: ''
    },
    date: {
      type: Date
    },
    dateTime: {
      type: Date
    },
    time: {
      type: String,
      default: ''
    },
    durationMinutes: {
      type: Number,
      default: 60
    },
    location: {
      venue: { type: String, default: '' },
      address: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, default: '' },
      isOnline: { type: Boolean, default: false },
      meetingLink: { type: String, trim: true, default: '' }
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      default: 50
    },
    availableSeats: {
      type: Number,
      default: 50
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    media: [
      {
        url: String,
        publicId: String,
        type: { type: String, default: 'image' }
      }
    ],
    status: {
      type: String,
      enum: Object.values(EVENT_STATUS || {
        DRAFT: 'draft',
        PENDING_APPROVAL: 'pending_approval',
        PUBLISHED: 'published',
        ONGOING: 'ongoing',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled'
      }),
      default: 'draft',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Sync date/dateTime and capacity/availableSeats
eventSchema.pre('save', function (next) {
  if (this.dateTime && !this.date) {
    this.date = this.dateTime;
  }
  if (this.date && !this.dateTime) {
    this.dateTime = this.date;
  }
  if (this.capacity !== undefined) {
    const booked = this.bookedCount || 0;
    this.availableSeats = Math.max(0, this.capacity - booked);
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
