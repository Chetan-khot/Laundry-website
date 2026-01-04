const express = require('express');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create payment
router.post('/', [
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  body('paymentType').isIn(['Order', 'Membership']).withMessage('Payment type must be Order or Membership')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { amount, paymentMethod, paymentType, orderId, planName } = req.body;

    // For demo purposes, always mark as success
    // In production, integrate with actual payment gateway
    const payment = new Payment({
      userId: req.userId,
      orderId: orderId || null,
      amount,
      paymentMethod,
      paymentType,
      planName: planName || null,
      status: 'Success'
    });

    await payment.save();

    // If payment is for an order, update order payment status
    if (paymentType === 'Order' && orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'Paid',
        paymentId: payment._id
      });
    }

    // If payment is for membership, update user membership
    if (paymentType === 'Membership' && planName) {
      const user = await User.findById(req.userId);
      const membershipDuration = 365; // 1 year in days
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + membershipDuration);

      user.membership = {
        plan: planName.replace(' Membership', ''),
        startDate,
        endDate,
        status: 'active'
      };

      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Payment successful!',
      payment
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment processing failed.' 
    });
  }
});

// Get all payments for current user
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId })
      .populate('orderId', 'serviceType totalAmount status')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch payments.' 
    });
  }
});

// Get single payment
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    }).populate('orderId');
    
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found.' 
      });
    }
    
    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch payment.' 
    });
  }
});

module.exports = router;

