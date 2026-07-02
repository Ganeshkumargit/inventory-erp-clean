import api from "../api/axios";

const getProducts = () => {
  return api.get("/products");
};

const addProduct = (formData) => {
  return api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateProduct = (id, formData) => {
  return api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

export default {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};