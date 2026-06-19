const express = require('express');
const Joi = require('joi');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation schema
const expenseSchema = Joi.object({
  category: Joi.string().valid('development', 'materials', 'labor', 'utilities', 'marketing', 'other').required(),
  description: Joi.string().required(),
  amount: Joi.number().positive().required(),
  expenseDate: Joi.date().required(),
  vendor: Joi.string().required(),
  paymentMethod: Joi.string().valid('cash', 'bank_transfer', 'check', 'mobile_money').required()
});

// @route   GET /api/expenses
// @desc    Get all expenses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/expenses/category/:category
// @desc    Get expenses by category
// @access  Private
router.get('/category/:category', auth, async (req, res) => {
  try {
    const expenses = await Expense.findByCategory(req.params.category);
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/expenses
// @desc    Create new expense
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Validate request body
    const { error } = expenseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate request body
    const { error } = expenseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const updatedExpense = await Expense.update(req.params.id, req.body);
    res.json(updatedExpense);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await Expense.delete(req.params.id);
    res.json({ message: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;