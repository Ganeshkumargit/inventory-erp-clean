import api from "../api/axios";

const getDocuments = () => api.get("/documents");

const uploadDocument = (formData) => {
  return api.post("/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getDownloadUrl = (id) => api.get(`/documents/${id}/download-url`);

const deleteDocument = (id) => api.delete(`/documents/${id}`);

export default {
  getDocuments,
  uploadDocument,
  getDownloadUrl,
  deleteDocument,
};