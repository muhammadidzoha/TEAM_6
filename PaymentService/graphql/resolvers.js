const mysql = require("mysql2/promise");
const axios = require("axios");

// Definisikan konfigurasi di sini agar resolver mandiri
const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "eai_project",
};

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5003/graphql';


const resolvers = {
  // SALIN FUNGSI-FUNGSI DARI 'root' DI index.js LAMA ANDA KE SINI
  getPaymentByOrderId: async ({ order_id }) => {
    // ... (logika lengkap Anda)
  },

  createPayment: async ({ order_id, amount, payment_method }) => {
    // ... (logika lengkap Anda)
  },
};

module.exports = resolvers;