const express = require('express');
const Joi = require('joi');
const Plot = require('../models/Plot');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation schema
const plotSchema = Joi.object({
  plotNumber: Joi.string().required(),
  size: Joi.number().positive().required(),
  price: Joi.number().positive().required(),
  location: Joi.string().required(),
  status: Joi.string().valid('available', 'booked', 'sold').required(),
  customerId: Joi.number().allow(null)
});

// @route   GET /api/plots
// @desc    Get all plots
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const plots = await Plot.findAll();
    res.json(plots);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/plots/:id
// @desc    Get plot by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const plot = await Plot.findById(req.params.id);
    
    if (!plot) {
      return res.status(404).json({ message: 'Plot not found' });
    }
    
    res.json(plot);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/plots/status/:status
// @desc    Get plots by status
// @access  Private
router.get('/status/:status', auth, async (req, res) => {
  try {
    const plots = await Plot.findByStatus(req.params.status);
    res.json(plots);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/plots
// @desc    Create new plot
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Validate request body
    const { error } = plotSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const plot = await Plot.create(req.body);
    res.status(201).json(plot);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/plots/:id
// @desc    Update plot
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate request body
    const { error } = plotSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const plot = await Plot.findById(req.params.id);
    
    if (!plot) {
      return res.status(404).json({ message: 'Plot not found' });
    }

    const updatedPlot = await Plot.update(req.params.id, req.body);
    res.json(updatedPlot);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/plots/:id
// @desc    Delete plot
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const plot = await Plot.findById(req.params.id);
    
    if (!plot) {
      return res.status(404).json({ message: 'Plot not found' });
    }

    await Plot.delete(req.params.id);
    res.json({ message: 'Plot removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;