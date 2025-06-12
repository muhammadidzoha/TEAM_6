require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { sequelize, PaymentHistory } = require('./models');

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json()); // Add this to parse JSON requests

  // Initialize database connection
  try {
    await sequelize.sync();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  // REST API endpoint for POST /history (compatibility with old app.py)
  app.post('/history', async (req, res) => {
    try {
      const data = req.body;
      const required_fields = ['order_id', 'user_id', 'amount', 'payment_method', 'payment_status'];

      // Validasi field yang diperlukan
      if (!required_fields.every(key => key in data)) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Masukkan data ke tabel payment_history menggunakan Sequelize
      const paymentHistory = await PaymentHistory.create({
        order_id: data.order_id,
        user_id: data.user_id,
        amount: data.amount,
        payment_method: data.payment_method,
        payment_status: data.payment_status.toUpperCase() // Convert to uppercase for ENUM
      });

      res.status(201).json({ 
        message: 'Payment history recorded successfully',
        id: paymentHistory.id
      });

    } catch (error) {
      console.error('Error in POST /history:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // REST API endpoint for GET /history (compatibility with old app.py)
  app.get('/history', async (req, res) => {
    try {
      // Use raw query to join with other tables
      const [results] = await sequelize.query(`
        SELECT 
          ph.id AS payment_id,
          ph.order_id,
          ph.user_id,
          ph.amount,
          ph.payment_method,
          ph.payment_status,
          ph.created_at,
          p.id AS product_id,
          p.name AS product_name,
          p.description AS product_description,
          p.image AS product_image
        FROM payment_history ph
        JOIN order_items oi ON ph.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        ORDER BY ph.created_at DESC
      `);

      res.json(results);
    } catch (error) {
      console.error('Error in GET /history:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: ({ req }) => {
      return {
        req
      };
    }
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5005;
  app.listen(PORT, () => {
    console.log(`🚀 HistoryService ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`📡 REST API endpoints available at http://localhost:${PORT}`);
  });
}

startServer();