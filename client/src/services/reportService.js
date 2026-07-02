import api from "../api/axios";

const getInventoryReport = () => api.get("/reports/inventory");

export default {
  getInventoryReport,
};