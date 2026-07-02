import api from "../api/axios";

const getStockHistory = () => api.get("/stock");

export default {
  getStockHistory,
};