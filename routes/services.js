const express = require('express');

const router = express.Router();

// Get available services and pricing
router.get('/', (req, res) => {
  const services = [
    {
      name: 'Wash & Fold',
      description: 'Daily wear washed & neatly folded — quick turnaround.',
      pricePerKg: 79,
      expressPricePerKg: 129,
      turnaroundTime: '48-72 hours',
      expressTurnaroundTime: '24-48 hours'
    },
    {
      name: 'Dry Cleaning',
      description: 'Safe dry cleaning for suits, sarees, and delicates.',
      pricePerKg: 199,
      turnaroundTime: '3-5 days'
    },
    {
      name: 'Steam Ironing',
      description: 'Crisp ironing and finishing for all clothes.',
      pricePerKg: 50,
      turnaroundTime: '24-48 hours'
    },
    {
      name: 'Home Linen',
      description: 'Bedsheets, curtains, quilts — handled with care.',
      pricePerKg: 149,
      turnaroundTime: '3-5 days'
    }
  ];

  res.json({
    success: true,
    services
  });
});

// Get membership plans
router.get('/memberships', (req, res) => {
  const memberships = [
    {
      name: 'Silver',
      price: 999,
      duration: '1 year',
      benefits: ['Up to 10 kg laundry', '5% discount on all services'],
      weightLimit: 10
    },
    {
      name: 'Gold',
      price: 1799,
      duration: '1 year',
      benefits: ['Up to 20 kg laundry', '5% discount on all services', 'Priority service'],
      weightLimit: 20
    },
    {
      name: 'Platinum',
      price: 2499,
      duration: '1 year',
      benefits: ['Up to 30 kg laundry', '5% discount on all services', 'Priority service', 'Free pickup & delivery'],
      weightLimit: 30
    }
  ];

  res.json({
    success: true,
    memberships
  });
});

module.exports = router;

