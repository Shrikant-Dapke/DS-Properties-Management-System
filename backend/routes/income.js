const express = require('express');
const Joi = require('joi');
const Income = require('../models/Income');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation schema
const incomeSchema = Joi.object({
  customerId: Joi.number().required(),
  plotId: Joi.number().required(),
  amount: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid('cash', 'bank_transfer', 'check', 'mobile_money').required(),
  paymentDate: Joi.date().required(),
  notes: Joi.string().allow(''),
  installmentNumber: Joi.number().allow(null)
});

// @route   GET /api/income
// @desc    Get all income records
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const income = await Income.findAll();
    res.json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/income/:id
// @desc    Get income record by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    
    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }
    
    res.json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/income/customer/:customerId
// @desc    Get income records by customer ID
// @access  Private
router.get('/customer/:customerId', auth, async (req, res) => {
  try {
    const income = await Income.findByCustomerId(req.params.customerId);
    res.json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/income
// @desc    Create new income record
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Validate request body
    const { error } = incomeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const income = await Income.create(req.body);
    res.status(201).json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/income/:id
// @desc    Update income record
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate request body
    const { error } = incomeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const income = await Income.findById(req.params.id);
    
    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }

    const updatedIncome = await Income.update(req.params.id, req.body);
    res.json(updatedIncome);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/income/:id
// @desc    Delete income record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    
    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }

    await Income.delete(req.params.id);
    res.json({ message: 'Income record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;