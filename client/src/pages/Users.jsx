import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../common/PageHeader";
import FormCard from "../common/FormCard";
import DataTable from "../common/DataTable";
import SearchBox from "../common/SearchBox";
import LoadingSpinner from "../common/LoadingSpinner";

import userService from "../services/userService";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STAFF",
    mobile: "",
    is_active: 1,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers();
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Mobile" },
    { key: "role", label: "Role" },
    {
      key: "is_active",
      label: "Status",
      render: (row) =>
        row.is_active === 1 ? (
          <span className="badge bg-success">Active</span>
        ) : (
          <span className="badge bg-danger">Inactive</span>
        ),
    },
  ];

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.mobile} ${user.role}`
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
    setEditId(null);

    setForm({
      name: "",
      email: "",
      password: "",
      role: "STAFF",
      mobile: "",
      is_active: 1,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await userService.updateUser(editId, {
          name: form.name,
          role: form.role,
          mobile: form.mobile,
          is_active: Number(form.is_active),
        });

        toast.success("User updated successfully");
      } else {
        await userService.createUser(form);
        toast.success("User created successfully");
      }

      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (user) => {
    setEditId(user.user_id);

    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "STAFF",
      mobile: user.mobile || "",
      is_active: user.is_active,
    });
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Create users and manage role access"
      />

      <div className="row">
        <div className="col-md-4">
          <FormCard title={editId ? "Edit User" : "Create User"}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!!editId}
                  required
                />
              </div>

              {!editId && (
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    className="form-control"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Mobile</label>
                <input
                  className="form-control"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-control"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="STAFF">Staff</option>
                  <option value="MANAGER">Manager</option>
                  <option value="REPORT_VIEWER">Report Viewer</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  name="is_active"
                  value={form.is_active}
                  onChange={handleChange}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>

              <button className="btn btn-primary me-2">
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
            placeholder="Search users..."
          />

          {loading ? (
            <LoadingSpinner message="Loading users..." />
          ) : (
            <DataTable
              columns={columns}
              data={filteredUsers}
              emptyMessage="No users found"
              renderActions={(user) => (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;