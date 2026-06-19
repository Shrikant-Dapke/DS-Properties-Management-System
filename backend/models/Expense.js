const pool = require('../config/db');

class Expense {
  static async create(expenseData) {
    const { category, description, amount, expenseDate, vendor, paymentMethod } = expenseData;
    
    const query = `
      INSERT INTO expenses (category, description, amount, expense_date, vendor, payment_method)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [category, description, amount, expenseDate, vendor, paymentMethod];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM expenses ORDER BY expense_date DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM expenses WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCategory(category) {
    const query = 'SELECT * FROM expenses WHERE category = $1 ORDER BY expense_date DESC';
    const result = await pool.query(query, [category]);
    return result.rows;
  }

  static async update(id, expenseData) {
    const { category, description, amount, expenseDate, vendor, paymentMethod } = expenseData;
    
    const query = `
      UPDATE expenses 
      SET category = $1, description = $2, amount = $3, expense_date = $4, vendor = $5, payment_method = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;
    
    const values = [category, description, amount, expenseDate, vendor, paymentMethod, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM expenses WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getTotalExpenses() {
    const query = 'SELECT SUM(amount) as total FROM expenses';
    const result = await pool.query(query);
    return result.rows[0];
  }

  static async getExpensesByCategory() {
    const query = `
      SELECT category, SUM(amount) as total
      FROM expenses
      GROUP BY category
      ORDER BY total DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getExpensesByMonth() {
    const query = `
      SELECT 
        DATE_TRUNC('month', expense_date) as month,
        SUM(amount) as total
      FROM expenses
      WHERE expense_date >= DATE_TRUNC('year', CURRENT_DATE)
      GROUP BY DATE_TRUNC('month', expense_date)
      ORDER BY month
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Expense;