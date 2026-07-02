import { useEffect, useState } from "react";
import PageHeader from "../common/PageHeader";
import FormCard from "../common/FormCard";
import DataTable from "../common/DataTable";
import categoryService from "../services/categoryService";
import SearchBox from "../common/SearchBox";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const fetchCategories = async () => {
    const res = await categoryService.getCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    {
      key: "category_name",
      label: "Category Name",
    },
    {
      key: "created_at",
      label: "Created At",
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await categoryService.updateCategory(editId, {
          category_name: categoryName,
        });
        setMessage("Category updated successfully");
      } else {
        await categoryService.addCategory({
          category_name: categoryName,
        });
        setMessage("Category added successfully");
      }

      setCategoryName("");
      setEditId(null);
      fetchCategories();
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (category) => {
    setEditId(category.category_id);
    setCategoryName(category.category_name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    await categoryService.deleteCategory(id);
    fetchCategories();
  };


  const filteredCategories = categories.filter((category) =>
  category.category_name.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div>
      <PageHeader
        title="Category Management"
        subtitle="Create and manage product categories"
      />

      {message && <div className="alert alert-info">{message}</div>}

      <div className="row">
        <div className="col-md-4">
          <FormCard title={editId ? "Edit Category" : "Add Category"}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>

              <button className="btn btn-primary me-2" type="submit">
                {editId ? "Update" : "Save"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditId(null);
                    setCategoryName("");
                  }}
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
  placeholder="Search categories..."
/>

          <DataTable
            columns={columns}
            data={filteredCategories}
            emptyMessage="No categories found"
            renderActions={(category) => (
              <>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(category)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(category.category_id)}
                >
                  Delete
                </button>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default Categories;