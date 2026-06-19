const express = require('express');
const Plot = require('../models/Plot');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Get total income
    const totalIncomeResult = await Income.getTotalIncome();
    const totalIncome = totalIncomeResult ? parseFloat(totalIncomeResult.total) : 0;

    // Get total expenses
    const totalExpensesResult = await Expense.getTotalExpenses();
    const totalExpenses = totalExpensesResult ? parseFloat(totalExpensesResult.total) : 0;

    // Calculate current balance
    const currentBalance = totalIncome - totalExpenses;

    // Get plot counts by status
    const plotCounts = await Plot.getPlotCountByStatus();

    // Format plot counts
    const plotStats = {
      available: 0,
      booked: 0,
      sold: 0
    };

    plotCounts.forEach(item => {
      plotStats[item.status] = parseInt(item.count);
    });

    // Get income by month
    const incomeByMonth = await Income.getIncomeByMonth();

    // Get expenses by month
    const expensesByMonth = await Expense.getExpensesByMonth();

    // Get expenses by category
    const expensesByCategory = await Expense.getExpensesByCategory();

    res.json({
      financialOverview: {
        totalIncome,
        totalExpenses,
        currentBalance
      },
      plotOverview: plotStats,
      incomeByMonth,
      expensesByMonth,
      expensesByCategory
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;