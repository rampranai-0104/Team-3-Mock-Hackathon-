const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../constants');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    provider: {
      type: String,
      default: 'razorpay'
    },
    providerOrderId: {
      type: String,
      trim: true
    },
    providerPaymentId: {
      type: String,
      trim: true
    },
    razorpayOrderId: {
      type: String,
      default: ''
    },
    razorpayPaymentId: {
      type: String,
      default: ''
    },
    razorpaySignature: {
      type: String,
      default: ''
    },
    paymentMethod: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS || {
        CREATED: 'created',
        AUTHORIZED: 'authorized',
        CAPTURED: 'captured',
        FAILED: 'failed',
        REFUNDED: 'refunded'
      }),
      default: 'created',
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.pre('save', function (next) {
  if (this.razorpayOrderId && !this.providerOrderId) this.providerOrderId = this.razorpayOrderId;
  if (this.providerOrderId && !this.razorpayOrderId) this.razorpayOrderId = this.providerOrderId;
  if (this.razorpayPaymentId && !this.providerPaymentId) this.providerPaymentId = this.razorpayPaymentId;
  if (this.providerPaymentId && !this.razorpayPaymentId) this.razorpayPaymentId = this.providerPaymentId;
  next();
});

paymentSchema.index({ userId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ bookingId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
