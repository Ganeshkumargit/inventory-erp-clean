import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../common/PageHeader";
import FormCard from "../common/FormCard";
import DataTable from "../common/DataTable";
import SearchBox from "../common/SearchBox";
import LoadingSpinner from "../common/LoadingSpinner";
import confirmDelete from "../common/confirmDelete";

import documentService from "../services/documentService";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [storageType, setStorageType] = useState("LOCAL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentService.getDocuments();
      setDocuments(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const openFile = async (documentId) => {
    try {
      const res = await documentService.getDownloadUrl(documentId);
      window.open(res.data.url, "_blank");
    } catch (error) {
      toast.error("Unable to open file");
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "file_name", label: "File Name" },
    { key: "file_type", label: "File Type" },
    { key: "storage_type", label: "Storage" },
    {
      key: "uploaded_at",
      label: "Uploaded At",
      render: (row) => new Date(row.uploaded_at).toLocaleString(),
    },
    {
      key: "file_path",
      label: "File",
      render: (row) => (
        <button
          className="btn btn-info btn-sm"
          onClick={() => openFile(row.document_id)}
        >
          View / Download
        </button>
      ),
    },
  ];

  const filteredDocuments = documents.filter((doc) =>
    `${doc.title} ${doc.file_name} ${doc.file_type} ${doc.storage_type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setTitle("");
    setSelectedFile(null);
    setStorageType("LOCAL");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("storage_type", storageType);
      formData.append("file", selectedFile);

      await documentService.uploadDocument(formData);

      toast.success("Document uploaded successfully");

      resetForm();
      fetchDocuments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete("Delete this document?");

    if (!confirmed) return;

    await documentService.deleteDocument(id);

    toast.success("Document deleted successfully");
    fetchDocuments();
  };

  return (
    <div>
      <PageHeader
        title="Document Management"
        subtitle="Upload and manage ERP files using local storage and AWS S3"
      />

      <FormCard title="Upload Document">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Document Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Storage Type</label>
              <select
                className="form-control"
                value={storageType}
                onChange={(e) => setStorageType(e.target.value)}
              >
                <option value="LOCAL">Local Storage</option>
                <option value="AWS_S3">AWS S3</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Select File</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required
              />
            </div>

            <div className="col-md-2 mb-3 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                Upload
              </button>
            </div>
          </div>
        </form>
      </FormCard>

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="Search documents..."
      />

      {loading ? (
        <LoadingSpinner message="Loading documents..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredDocuments}
          emptyMessage="No documents found"
          renderActions={(doc) => (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(doc.document_id)}
            >
              Delete
            </button>
          )}
        />
      )}
    </div>
  );
}

export default Documents;