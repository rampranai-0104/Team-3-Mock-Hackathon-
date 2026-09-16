const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../constants');

const paymentSchema = new mongoose.Schema(
  {
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
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.CREATED,
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

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
