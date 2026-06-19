const pool = require('../config/db');

class Income {
  static async create(incomeData) {
    const { customerId, plotId, amount, paymentMethod, paymentDate, notes, installmentNumber } = incomeData;
    
    const query = `
      INSERT INTO income (customer_id, plot_id, amount, payment_method, payment_date, notes, installment_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [customerId, plotId, amount, paymentMethod, paymentDate, notes, installmentNumber];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT i.*, c.name as customer_name, p.plot_number
      FROM income i
      LEFT JOIN customers c ON i.customer_id = c.id
      LEFT JOIN plots p ON i.plot_id = p.id
      ORDER BY i.payment_date DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT i.*, c.name as customer_name, p.plot_number
      FROM income i
      LEFT JOIN customers c ON i.customer_id = c.id
      LEFT JOIN plots p ON i.plot_id = p.id
      WHERE i.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCustomerId(customerId) {
    const query = `
      SELECT i.*, c.name as customer_name, p.plot_number
      FROM income i
      LEFT JOIN customers c ON i.customer_id = c.id
      LEFT JOIN plots p ON i.plot_id = p.id
      WHERE i.customer_id = $1
      ORDER BY i.payment_date DESC
    `;
    const result = await pool.query(query, [customerId]);
    return result.rows;
  }

  static async update(id, incomeData) {
    const { customerId, plotId, amount, paymentMethod, paymentDate, notes, installmentNumber } = incomeData;
    
    const query = `
      UPDATE income 
      SET customer_id = $1, plot_id = $2, amount = $3, payment_method = $4, payment_date = $5, notes = $6, installment_number = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `;
    
    const values = [customerId, plotId, amount, paymentMethod, paymentDate, notes, installmentNumber, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM income WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getTotalIncome() {
    const query = 'SELECT SUM(amount) as total FROM income';
    const result = await pool.query(query);
    return result.rows[0];
  }

  static async getIncomeByMonth() {
    const query = `
      SELECT 
        DATE_TRUNC('month', payment_date) as month,
        SUM(amount) as total
      FROM income
      WHERE payment_date >= DATE_TRUNC('year', CURRENT_DATE)
      GROUP BY DATE_TRUNC('month', payment_date)
      ORDER BY month
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Income;