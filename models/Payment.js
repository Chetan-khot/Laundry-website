const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Card', 'UPI', 'NetBanking', 'COD']
  },
  paymentType: {
    type: String,
    enum: ['Order', 'Membership'],
    required: true
  },
  planName: {
    type: String,
    trim: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate transaction ID before saving
paymentSchema.pre('save', async function(next) {
  if (!this.transactionId && this.status === 'Success') {
    this.transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);

