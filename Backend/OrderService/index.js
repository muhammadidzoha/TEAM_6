const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const axios = require("axios");

const app = express();
const PORT = 5003;

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
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_price DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )
    `);

    console.log("Orders and Order Items tables created successfully");
  } catch (error) {
    console.error("Error in initDb:", error.message);
  } finally {
    await conn.end();
  }
};

app.post("/orders", async (req, res) => {
  const { user_id, items } = req.body;

  if (!user_id || !items || items.length === 0) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    const userServiceUrl = `http://localhost:5001/users/${user_id}`;
    const userResponse = await axios.get(userServiceUrl);

    if (userResponse.status !== 200) {
      return res.status(404).json({ error: "User not found" });
    }

    const totalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const conn = await mysql.createConnection(DB_CONFIG);
    const [orderResult] = await conn.execute(
      "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
      [user_id, totalPrice]
    );
    const orderId = orderResult.insertId;

    const orderItemsPromises = items.map((item) =>
      conn.execute(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `,
        [orderId, item.product_id, item.quantity, item.price]
      )
    );
    await Promise.all(orderItemsPromises);

    await conn.end();

    res
      .status(201)
      .json({ message: "Order created successfully", order_id: orderId });
  } catch (error) {
    console.error("Error in create_order:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/orders/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const conn = await mysql.createConnection(DB_CONFIG);

    const [orders] = await conn.execute(
      "SELECT * FROM orders WHERE user_id = ?",
      [user_id]
    );

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await conn.execute(
          `
          SELECT 
            order_items.id AS order_id,
            order_items.quantity,
            order_items.price,
            products.id AS product_id,
            products.name AS product_name,
            products.description AS product_description,
            products.image AS product_image
          FROM order_items
          JOIN products ON order_items.product_id = products.id
          WHERE order_items.order_id = ?
          `,
          [order.id]
        );
        return { ...order, items };
      })
    );

    await conn.end();

    res.json(ordersWithItems);
  } catch (error) {
    console.error("Error in get_orders_by_user:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/orders/id/:order_id", async (req, res) => {
  const { order_id } = req.params;

  try {
    const conn = await mysql.createConnection(DB_CONFIG);

    const [orders] = await conn.execute("SELECT * FROM orders WHERE id = ?", [
      order_id,
    ]);

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const [items] = await conn.execute(
      `
      SELECT 
        order_items.id AS order_item_id,
        order_items.quantity,
        order_items.price,
        products.id AS product_id,
        products.name AS product_name,
        products.description AS product_description,
        products.image AS product_image
      FROM order_items
      JOIN products ON order_items.product_id = products.id
      WHERE order_items.order_id = ?
      `,
      [order_id]
    );

    await conn.end();

    res.json({ ...orders[0], items });
  } catch (error) {
    console.error("Error in get_order_by_id:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  await initDb();
  console.log(`OrderService is running on http://localhost:${PORT}`);
});
