import axios from "axios";

const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE,
});

export const getAllUsers = async () => {
  try {
    const response = await userApi.get("/users");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await userApi.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
