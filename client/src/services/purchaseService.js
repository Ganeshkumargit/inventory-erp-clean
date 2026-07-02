import api from "../api/axios";

const getPurchases = () => api.get("/purchases");

const addPurchase = (data) => api.post("/purchases", data);

export default {
  getPurchases,
  addPurchase,
};