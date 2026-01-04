const express = require('express');
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');

const router = express.Router();

// Middleware to check token (optional)
const optionalAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
        try {
            const jwt = require('jsonwebtoken'); // Ensure jwt is imported
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
            req.userId = decoded.userId;
        } catch (err) {
            console.error('Invalid token in feedback:', err.message);
        }
    }
    next();
};

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Public (Optional Auth)
router.post('/', optionalAuth, [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required')
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

        const { name, email, rating, comment } = req.body;

        const feedback = new Feedback({
            name,
            email,
            rating,
            comment,
            user: req.userId || null // Save user ID if available
        });

        await feedback.save();

        console.log('Feedback saved:', feedback);

        // Save to local file as requested
        const fs = require('fs');
        const path = require('path');
        const logEntry = `Date: ${new Date().toISOString()} | Name: ${name} | Email: ${email || 'N/A'} | Rating: ${rating} | Comment: ${comment}\n`;

        fs.appendFile(path.join(__dirname, '../feedbacks.txt'), logEntry, (err) => {
            if (err) console.error('Failed to write to local feedback file:', err);
        });

        res.status(201).json({
            success: true,
            message: 'Thank you for your feedback!'
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback. Please try again.'
        });
    }
});

// @route   GET /api/feedback
// @desc    Get all feedbacks
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: feedbacks.length,
            data: feedbacks
        });
    } catch (error) {
        console.error('Fetch feedbacks error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedbacks'
        });
    }
});

module.exports = router;
