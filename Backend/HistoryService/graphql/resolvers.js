const { PaymentHistory, sequelize } = require('../models');
const axios = require('axios');

const PRODUCT_SERVICE_URL = 'http://localhost:5002';
const ORDER_SERVICE_URL = 'http://localhost:5003';

const resolvers = {
  Query: {
    paymentHistories: async () => {
      try {
        const histories = await PaymentHistory.findAll({
          order: [['created_at', 'DESC']]
        });
        
        return histories.map(history => ({
          id: history.id,
          order_id: history.order_id,
          user_id: history.user_id,
          amount: parseFloat(history.amount),
          payment_method: history.payment_method,
          payment_status: history.payment_status?.toLowerCase() || 'pending',
          created_at: history.created_at?.toISOString() || null
        }));
      } catch (error) {
        console.error('Error fetching payment histories:', error);
        throw new Error('Failed to fetch payment histories');
      }
    },
    
    paymentHistory: async (_, { id }) => {
      try {
        const history = await PaymentHistory.findByPk(id);
        if (!history) return null;
        
        return {
          id: history.id,
          order_id: history.order_id,
          user_id: history.user_id,
          amount: parseFloat(history.amount),
          payment_method: history.payment_method,
          payment_status: history.payment_status?.toLowerCase() || 'pending',
          created_at: history.created_at?.toISOString() || null
        };
      } catch (error) {
        console.error('Error fetching payment history:', error);
        throw new Error('Failed to fetch payment history');
      }
    },
    
    userPaymentHistory: async (_, { userId }) => {
      try {
        const histories = await PaymentHistory.findAll({
          where: { user_id: userId },
          order: [['created_at', 'DESC']]
        });
        
        return histories.map(history => ({
          id: history.id,
          order_id: history.order_id,
          user_id: history.user_id,
          amount: parseFloat(history.amount),
          payment_method: history.payment_method,
          payment_status: history.payment_status?.toLowerCase() || 'pending',
          created_at: history.created_at?.toISOString() || null
        }));
      } catch (error) {
        console.error('Error fetching user payment history:', error);
        throw new Error('Failed to fetch user payment history');
      }
    }
  },

  PaymentHistory: {
    products: async (parent) => {
      try {
        if (!parent.order_id) {
          console.log('No order_id found for payment history:', parent.id);
          return [];
        }

        // Get order details from OrderService
        const orderResponse = await axios.get(`${ORDER_SERVICE_URL}/orders/id/${parent.order_id}`);
        
        if (!orderResponse.data || !orderResponse.data.items) {
          console.log('No order items found for order_id:', parent.order_id);
          return [];
        }

        // Extract product information from order items
        const products = orderResponse.data.items.map(item => ({
          id: item.product_id,
          name: item.product_name,
          description: item.product_description,
          image: item.product_image
        }));

        return products;
      } catch (error) {
        console.error('Error fetching products for payment history:', error);
        // Return empty array instead of throwing error to avoid breaking the query
        return [];
      }
    }
  },

  Mutation: {
    createPaymentHistory: async (_, { input }) => {
      try {
        const history = await PaymentHistory.create({
          order_id: input.orderId,
          user_id: input.userId,
          amount: input.amount,
          payment_method: input.paymentMethod,
          payment_status: input.paymentStatus.toUpperCase()
        });
        
        return {
          id: history.id,
          order_id: history.order_id,
          user_id: history.user_id,
          amount: parseFloat(history.amount),
          payment_method: history.payment_method,
          payment_status: history.payment_status?.toLowerCase() || 'pending',
          created_at: history.created_at?.toISOString() || null
        };
      } catch (error) {
        console.error('Error creating payment history:', error);
        throw new Error('Failed to create payment history');
      }
    },
    
    updatePaymentStatus: async (_, { id, status }) => {
      try {
        const paymentHistory = await PaymentHistory.findByPk(id);
        if (!paymentHistory) {
          throw new Error('Payment history not found');
        }
        
        paymentHistory.payment_status = status.toUpperCase();
        await paymentHistory.save();
        
        return {
          id: paymentHistory.id,
          order_id: paymentHistory.order_id,
          user_id: paymentHistory.user_id,
          amount: parseFloat(paymentHistory.amount),
          payment_method: paymentHistory.payment_method,
          payment_status: paymentHistory.payment_status?.toLowerCase() || 'pending',
          created_at: paymentHistory.created_at?.toISOString() || null
        };
      } catch (error) {
        console.error('Error updating payment status:', error);
        throw new Error('Failed to update payment status');
      }
    }
  }
};

module.exports = resolvers;