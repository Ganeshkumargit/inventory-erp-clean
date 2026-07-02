import { useEffect, useState } from "react";
import PageHeader from "../common/PageHeader";
import FormCard from "../common/FormCard";
import DataTable from "../common/DataTable";
import SearchBox from "../common/SearchBox";
import LoadingSpinner from "../common/LoadingSpinner";
import supplierService from "../services/supplierService";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState({
    supplier_name: "",
    mobile: "",
    email: "",
    address: "",
  });

  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);

      const res = await supplierService.getSuppliers();
      setSuppliers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const columns = [
    {
      key: "supplier_name",
      label: "Supplier Name",
    },
    {
      key: "mobile",
      label: "Mobile",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "address",
      label: "Address",
    },
  ];

  const filteredSuppliers = suppliers.filter((supplier) =>
    `${supplier.supplier_name} ${supplier.mobile} ${supplier.email} ${supplier.address}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      supplier_name: "",
      mobile: "",
      email: "",
      address: "",
    });

    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await supplierService.updateSupplier(editId, form);
        setMessage("Supplier updated successfully");
      } else {
        await supplierService.addSupplier(form);
        setMessage("Supplier added successfully");
      }

      resetForm();
      fetchSuppliers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (supplier) => {
    setEditId(supplier.supplier_id);

    setForm({
      supplier_name: supplier.supplier_name,
      mobile: supplier.mobile,
      email: supplier.email,
      address: supplier.address,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this supplier?")) {
      return;
    }

    await supplierService.deleteSupplier(id);
    fetchSuppliers();
  };

  return (
    <div>
      <PageHeader
        title="Supplier Management"
        subtitle="Manage supplier information"
      />

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <div className="row">
        <div className="col-md-4">
          <FormCard
            title={editId ? "Edit Supplier" : "Add Supplier"}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Supplier Name</label>

                <input
                  type="text"
                  className="form-control"
                  name="supplier_name"
                  value={form.supplier_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mobile</label>

                <input
                  type="text"
                  className="form-control"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>

                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>

                <textarea
                  className="form-control"
                  rows="3"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                className="btn btn-primary me-2"
                type="submit"
              >
                {editId ? "Update" : "Save"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </form>
          </FormCard>
        </div>

        <div className="col-md-8">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search suppliers..."
          />

          {loading ? (
            <LoadingSpinner message="Loading suppliers..." />
          ) : (
            <DataTable
              columns={columns}
              data={filteredSuppliers}
              emptyMessage="No suppliers found"
              renderActions={(supplier) => (
                <>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(supplier)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      handleDelete(supplier.supplier_id)
                    }
                  >
                    Delete
                  </button>
                </>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Suppliers;