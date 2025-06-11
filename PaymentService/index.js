const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const axios = require("axios");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5004;

app.use(cors());
app.use(express.json());

// --- Konfigurasi dari Environment Variables untuk Docker ---
// Ini lebih aman dan fleksibel daripada hardcode
const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "eai_project",
};

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5003/graphql';

// --- Inisialisasi Database (Hanya untuk setup awal) ---
const initDb = async () => {
  // Membuat koneksi tanpa memilih database terlebih dahulu
  const tempConn = await mysql.createConnection({
    host: DB_CONFIG.host,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password
  });
  // Membuat database jika belum ada
  await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\``);
  await tempConn.end();

  // Koneksi ke database yang spesifik
  const conn = await mysql.createConnection(DB_CONFIG);
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabel 'payments' siap digunakan.");
  } catch (error) {
    console.error("Error saat inisialisasi DB:", error.message);
  } finally {
    await conn.end();
  }
};

// --- Membaca dan Membangun Skema GraphQL ---
const schema = buildSchema(
  fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8")
);

// --- Resolvers: Logika di balik setiap operasi GraphQL ---
const root = {
  // Resolver untuk Query `getPaymentByOrderId`
  getPaymentByOrderId: async ({ order_id }) => {
    try {
      const conn = await mysql.createConnection(DB_CONFIG);
      const [payments] = await conn.execute(
        "SELECT * FROM payments WHERE order_id = ?",
        [order_id]
      );
      await conn.end();
      return payments;
    } catch (error) {
      console.error("Error di getPaymentByOrderId:", error.message);
      throw new Error("Gagal mengambil data pembayaran.");
    }
  },

  // Resolver untuk Mutation `createPayment`
  createPayment: async ({ order_id, amount, payment_method }) => {
    if (!order_id || !amount || !payment_method) {
      throw new Error("Data tidak valid.");
    }

    try {
      // 1. Mengkonsumsi endpoint GraphQL dari Order Service 
      const orderQuery = `
        query GetOrderDetails($orderId: Int!) {
          getOrderById(id: $orderId) {
            total_price
          }
        }
      `;
      
      const orderResponse = await axios.post(ORDER_SERVICE_URL, {
        query: orderQuery,
        variables: { orderId: order_id },
      });
      
      const order = orderResponse.data.data.getOrderById;

      if (!order) {
        throw new Error("Pesanan tidak ditemukan.");
      }
      
      // 2. Validasi jumlah pembayaran
      if (parseFloat(amount) !== parseFloat(order.total_price)) {
        throw new Error("Jumlah pembayaran tidak valid.");
      }
      
      // 3. Simpan pembayaran ke database sendiri
      const conn = await mysql.createConnection(DB_CONFIG);
      const [paymentResult] = await conn.execute(
        `INSERT INTO payments (order_id, amount, payment_method, payment_status) VALUES (?, ?, ?, 'completed')`,
        [order_id, amount, payment_method]
      );
      
      // 4. Ambil data pembayaran yang baru dibuat untuk dikembalikan
      const [newPayment] = await conn.execute('SELECT * FROM payments WHERE id = ?', [paymentResult.insertId]);
      await conn.end();

      // PENTING: Jangan update tabel service lain! 
      // Sebagai gantinya, panggil mutation ke Order Service untuk update status
      // (Ini akan kamu implementasikan bersama kelompok lain)
      // Contoh: await axios.post(ORDER_SERVICE_URL, { query: 'mutation { updateOrderStatus(...) }' });

      console.log("Pembayaran berhasil diproses untuk order_id:", order_id);
      return newPayment[0];

    } catch (error) {
      console.error("Error di createPayment:", error.message);
      // Mengembalikan pesan error yang lebih informatif ke client
      if (error.response) {
         console.error('Error dari service lain:', error.response.data);
      }
      throw new Error(`Gagal memproses pembayaran: ${error.message}`);
    }
  },
};

// --- Setup Endpoint GraphQL ---
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Ini akan menampilkan UI untuk testing di browser
  })
);

// --- Menjalankan Server ---
app.listen(PORT, async () => {
  await initDb();
  console.log(
    `🚀 PaymentService (GraphQL) berjalan di http://localhost:${PORT}/graphql`
  );
});