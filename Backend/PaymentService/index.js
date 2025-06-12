const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const axios = require("axios");

const app = express();
const PORT = 5004;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "",
  database: "eai_project",
};

const initDb = async () => {
  const conn = await mysql.createConnection(DB_CONFIG);
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )
    `);

    console.log("Payments table created successfully");
  } catch (error) {
    console.error("Error in initDb:", error.message);
  } finally {
    await conn.end();
  }
};

app.post("/payments", async (req, res) => {
  const { order_id, amount, payment_method } = req.body;

  if (!order_id || !amount || !payment_method) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    const orderServiceUrl = `http://localhost:5003/orders/id/${order_id}`;
    const orderResponse = await axios.get(orderServiceUrl);

    if (orderResponse.status !== 200 || orderResponse.data.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResponse.data;

    if (parseFloat(amount) !== parseFloat(order.total_price)) {
      console.error("Jumlah pembayaran tidak valid:", {
        amount,
        total_price: order.total_price,
      });
      return res.status(400).json({ error: "Invalid payment amount" });
    }

    const conn = await mysql.createConnection(DB_CONFIG);
    const [paymentResult] = await conn.execute(
      `
      INSERT INTO payments (order_id, amount, payment_method, payment_status)
      VALUES (?, ?, ?, 'completed')
    `,
      [order_id, amount, payment_method]
    );

    const items = order.items;
    for (const item of items) {
      await conn.execute(
        `
        UPDATE products
        SET stock = stock - ?
        WHERE id = ? AND stock >= ?
        `,
        [item.quantity, item.product_id, item.quantity]
      );
    }

    await conn.end();

    res.status(201).json({
      message: "Payment processed successfully",
      payment_id: paymentResult.insertId,
    });
  } catch (error) {
    console.error("Error in process_payment:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/payments/:order_id", async (req, res) => {
  const { order_id } = req.params;

  try {
    const conn = await mysql.createConnection(DB_CONFIG);

    const [payments] = await conn.execute(
      "SELECT * FROM payments WHERE order_id = ?",
      [order_id]
    );

    await conn.end();

    res.json(payments);
  } catch (error) {
    console.error("Error in get_payments_by_order:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  await initDb();
  console.log(`PaymentService is running on http://localhost:${PORT}`);
});
