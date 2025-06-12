import axios from "axios";

const paymentApi = axios.create({
  baseURL: import.meta.env.VITE_PAYMENTS_SERVICE,
});

export const processPayment = async (paymentData) => {
  try {
    const response = await paymentApi.post(`/payments`, paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPaymentByOrderId = async (order_id) => {
  try {
    const response = await paymentApi.get(`payments/${order_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
