const pool = require('../config/db');

class Plot {
  static async create(plotData) {
    const { plotNumber, size, price, location, status, customerId } = plotData;
    
    const query = `
      INSERT INTO plots (plot_number, size, price, location, status, customer_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [plotNumber, size, price, location, status, customerId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT p.*, c.name as customer_name, c.email as customer_email 
      FROM plots p 
      LEFT JOIN customers c ON p.customer_id = c.id 
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, c.name as customer_name, c.email as customer_email 
      FROM plots p 
      LEFT JOIN customers c ON p.customer_id = c.id 
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByPlotNumber(plotNumber) {
    const query = 'SELECT * FROM plots WHERE plot_number = $1';
    const result = await pool.query(query, [plotNumber]);
    return result.rows[0];
  }

  static async findByStatus(status) {
    const query = `
      SELECT p.*, c.name as customer_name, c.email as customer_email 
      FROM plots p 
      LEFT JOIN customers c ON p.customer_id = c.id 
      WHERE p.status = $1 
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query, [status]);
    return result.rows;
  }

  static async update(id, plotData) {
    const { plotNumber, size, price, location, status, customerId } = plotData;
    
    const query = `
      UPDATE plots 
      SET plot_number = $1, size = $2, price = $3, location = $4, status = $5, customer_id = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;
    
    const values = [plotNumber, size, price, location, status, customerId, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM plots WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getPlotCountByStatus() {
    const query = `
      SELECT status, COUNT(*) as count 
      FROM plots 
      GROUP BY status
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Plot;