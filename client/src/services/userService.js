import api from "../api/axios";

const getUsers = () => api.get("/users");

const createUser = (data) => api.post("/users", data);

const updateUser = (id, data) => api.put(`/users/${id}`, data);

export default {
  getUsers,
  createUser,
  updateUser,
};