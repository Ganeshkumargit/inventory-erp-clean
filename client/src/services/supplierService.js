import api from "../api/axios";

const getSuppliers = () => {
  return api.get("/suppliers");
};

const addSupplier = (data) => {
  return api.post("/suppliers", data);
};

const updateSupplier = (id, data) => {
  return api.put(`/suppliers/${id}`, data);
};

const deleteSupplier = (id) => {
  return api.delete(`/suppliers/${id}`);
};

export default {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
};