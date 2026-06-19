const pool = require('../config/db');

class Customer {
  static async create(customerData) {
    const { name, email, phone, address, city, state, zipCode, country } = customerData;
    
    const query = `
      INSERT INTO customers (name, email, phone, address, city, state, zip_code, country)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [name, email, phone, address, city, state, zipCode, country];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM customers ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM customers WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, customerData) {
    const { name, email, phone, address, city, state, zipCode, country } = customerData;
    
    const query = `
      UPDATE customers 
      SET name = $1, email = $2, phone = $3, address = $4, city = $5, state = $6, zip_code = $7, country = $8, updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;
    
    const values = [name, email, phone, address, city, state, zipCode, country, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM customers WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM customers WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }
}

module.exports = Customer;