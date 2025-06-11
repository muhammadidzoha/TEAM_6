const mysql = require("mysql2/promise");
const axios = require("axios");



// Definisikan konfigurasi di sini agar resolver mandiri
const DB_CONFIG = {
  host: process.env.DB_HOST || "payment-db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "eai_project",
};


const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5004/graphql';

const resolvers = {
  getPaymentByOrderId: async ({ order_id }) => {
    // ... (kode getPaymentByOrderId tidak diubah)
  },

  createPayment: async ({ order_id, amount, payment_method }) => {
    // 1. Log argumen yang masuk
    console.log('--- Mulai createPayment ---');
    console.log('Argumen diterima:', { order_id, amount, payment_method });

    let connection; // Definisikan di luar try agar bisa diakses di finally

    try {
      connection = await mysql.createConnection(DB_CONFIG);
      console.log('Koneksi database berhasil.');

      // 2. Log sebelum menjalankan INSERT
      console.log('Menjalankan query INSERT...');
      const [result] = await connection.execute(
        'INSERT INTO payments (order_id, amount, payment_method, payment_status) VALUES (?, ?, ?, ?)',
        [order_id, amount, payment_method, 'PENDING']
      );

      // 3. Log hasil dari INSERT
      console.log('Hasil INSERT:', result);

      // Pastikan ada ID yang dihasilkan
      if (!result.insertId) {
        console.error('INSERT gagal, tidak ada insertId yang dihasilkan.');
        // Kembalikan null atau throw error jika tidak ada baris yang dimasukkan
        await connection.end();
        return null; 
      }

      // 4. Log sebelum menjalankan SELECT
      console.log(`Mencari payment dengan ID: ${result.insertId}`);
      const [paymentRows] = await connection.execute(
        'SELECT * FROM payments WHERE id = ?',
        [result.insertId]
      );

      // 5. Log hasil dari SELECT
      console.log('Hasil SELECT:', paymentRows);

      // 6. Log data yang akan dikembalikan
      console.log('Data yang akan dikembalikan:', paymentRows[0]);
      console.log('--- Selesai createPayment ---');
      
      return paymentRows[0];

    } catch (error) {
      console.error('Error di dalam blok createPayment:', error);
      throw error; // Melempar error agar GraphQL client tahu ada masalah
    } finally {
      if (connection) {
        await connection.end();
        console.log('Koneksi database ditutup.');
      }
    }
  }
};

module.exports = resolvers;