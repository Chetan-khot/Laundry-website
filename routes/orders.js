const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all orders for current user
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('paymentId', 'amount paymentMethod status transactionId')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders.' 
    });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    }).populate('paymentId');
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found.' 
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order.' 
    });
  }
});

// Create new order
router.post('/', [
  body('serviceType').notEmpty().withMessage('Service type is required'),
  body('weight').isFloat({ min: 0.1 }).withMessage('Weight must be greater than 0'),
  body('pickupAddress').trim().notEmpty().withMessage('Pickup address is required'),
  body('pickupDate').isISO8601().withMessage('Valid pickup date is required')
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

    const { serviceType, weight, pickupAddress, pickupDate, specialInstructions } = req.body;

    // Price per kg based on service type
    const pricing = {
      'Wash & Fold': 79,
      'Dry Cleaning': 199,
      'Steam Ironing': 50,
      'Home Linen': 149
    };

    const pricePerKg = pricing[serviceType] || 79;
    const totalAmount = pricePerKg * weight;

    const order = new Order({
      userId: req.userId,
      serviceType,
      weight,
      pricePerKg,
      totalAmount,
      pickupAddress,
      pickupDate: new Date(pickupDate),
      specialInstructions: specialInstructions || ''
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order.' 
    });
  }
});

// Update order status (admin use, but included for completeness)
router.patch('/:id/status', [
  body('status').notEmpty().withMessage('Status is required')
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

    const order = await Order.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found.' 
      });
    }

    order.status = req.body.status;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated!',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update order.' 
    });
  }
});

module.exports = router;

