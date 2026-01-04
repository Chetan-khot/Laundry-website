const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['Wash & Fold', 'Dry Cleaning', 'Steam Ironing', 'Home Linen']
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  pickupAddress: {
    type: String,
    required: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  deliveryDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Picked Up', 'In Progress', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  specialInstructions: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);

