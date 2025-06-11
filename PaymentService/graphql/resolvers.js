const mysql = require("mysql2/promise");
const axios = require("axios");

// Definisikan konfigurasi di sini agar resolver mandiri
const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "eai_project",
};

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5003/graphql';


const resolvers = {
  getPaymentByOrderId: async ({ order_id }) => {
    const connection = await mysql.createConnection(DB_CONFIG);
    try {
      const [payments] = await connection.execute(
        'SELECT * FROM payments WHERE order_id = ?',
        [order_id]
      );
      return payments;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    } finally {
      await connection.end();
    }
  },

  createPayment: async ({ order_id, amount, payment_method }) => {
    const connection = await mysql.createConnection(DB_CONFIG);
    try {
      const [result] = await connection.execute(
        'INSERT INTO payments (order_id, amount, payment_method, payment_status) VALUES (?, ?, ?, ?)',
        [order_id, amount, payment_method, 'PENDING']
      );

      const [payment] = await connection.execute(
        'SELECT * FROM payments WHERE id = ?',
        [result.insertId]
      );

      return payment[0];
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }
};

module.exports = resolvers;