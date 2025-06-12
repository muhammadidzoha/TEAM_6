import axios from "axios";

const productsApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTS_SERVICE,
});

export const getAllProducts = async () => {
  try {
    const response = await productsApi.get("/products");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await productsApi.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await productsApi.post("/products", productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
