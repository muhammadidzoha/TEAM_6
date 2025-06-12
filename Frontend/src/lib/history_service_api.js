import axios from "axios";

const historyApi = axios.create({
  baseURL: import.meta.env.VITE_HISTORY_SERVICE,
});

export const getHistory = async () => {
  try {
    const response = await historyApi.get(`/history`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
