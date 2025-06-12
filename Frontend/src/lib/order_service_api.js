import axios from "axios";

const ordersApi = axios.create({
  baseURL: import.meta.env.VITE_ORDERS_SERVICE,
});

export const getOrdersByUser = async (id) => {
  try {
    const response = await ordersApi.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createOrder = async (userId, items) => {
  try {
    const response = await ordersApi.post(
      "/orders",
      {
        user_id: userId,
        items: items,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getOrdersById = async (id) => {
  try {
    const response = await ordersApi.get(`/order/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
