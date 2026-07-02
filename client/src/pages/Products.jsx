import { useEffect, useState } from "react";
import PageHeader from "../common/PageHeader";
import FormCard from "../common/FormCard";
import DataTable from "../common/DataTable";
import categoryService from "../services/categoryService";
import productService from "../services/productService";
import SearchBox from "../common/SearchBox";

function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    category_id: "",
    product_name: "",
    description: "",
    price: "",
    stock_qty: "",
  });

  const [image, setImage] = useState(null);
  const [oldImagePath, setOldImagePath] = useState("");
  const [preview, setPreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCategories = async () => {
    const res = await categoryService.getCategories();
    setCategories(res.data);
  };

  const fetchProducts = async () => {
    const res = await productService.getProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const columns = [
    {
      key: "image_path",
      label: "Image",
      render: (row) =>
        row.image_path ? (
          <img
            src={`${API_URL}${row.image_path}`}
            alt={row.product_name}
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
        ) : (
          <span className="text-muted">No Image</span>
        ),
    },
    {
      key: "category_name",
      label: "Category",
    },
    {
      key: "product_name",
      label: "Product",
    },
    {
      key: "price",
      label: "Price",
      render: (row) => `₹${row.price}`,
    },
    {
      key: "stock_qty",
      label: "Stock",
    },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm({
      category_id: "",
      product_name: "",
      description: "",
      price: "",
      stock_qty: "",
    });

    setImage(null);
    setOldImagePath("");
    setPreview("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("category_id", form.category_id);
      formData.append("product_name", form.product_name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock_qty", form.stock_qty);
      formData.append("old_image_path", oldImagePath);

      if (image) {
        formData.append("image", image);
      }

      if (editId) {
        await productService.updateProduct(editId, formData);
        setMessage("Product updated successfully");
      } else {
        await productService.addProduct(formData);
        setMessage("Product added successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (product) => {
    setEditId(product.product_id);

    setForm({
      category_id: product.category_id || "",
      product_name: product.product_name || "",
      description: product.description || "",
      price: product.price || "",
      stock_qty: product.stock_qty || "",
    });

    setOldImagePath(product.image_path || "");

    if (product.image_path) {
      setPreview(`${API_URL}${product.image_path}`);
    } else {
      setPreview("");
    }

    setImage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    await productService.deleteProduct(id);
    fetchProducts();
  };

  const filteredProducts = products.filter((product) =>
  `${product.product_name} ${product.category_name} ${product.price} ${product.stock_qty}`
    .toLowerCase()
    .includes(search.toLowerCase())
);

  return (
    <div>
      <PageHeader
        title="Product Management"
        subtitle="Create products, assign categories, manage images and stock"
      />

      {message && <div className="alert alert-info">{message}</div>}

      <FormCard title={editId ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Category</label>
              <select
                name="category_id"
                className="form-control"
                value={form.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                name="product_name"
                className="form-control"
                value={form.product_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2 mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2 mb-3">
              <label className="form-label">Stock Qty</label>
              <input
                type="number"
                name="stock_qty"
                className="form-control"
                value={form.stock_qty}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2 mb-3">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="2"
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {preview && (
              <div className="col-md-12 mb-3">
                <label className="form-label d-block">Image Preview</label>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              </div>
            )}
          </div>

          <button className="btn btn-primary me-2" type="submit">
            {editId ? "Update Product" : "Save Product"}
          </button>

          {editId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </FormCard>

      <SearchBox
  value={search}
  onChange={setSearch}
  placeholder="Search products..."
/>

      <DataTable
        columns={columns}
        data={filteredProducts}
        emptyMessage="No products found"
        renderActions={(product) => (
          <>
            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => handleEdit(product)}
            >
              Edit
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(product.product_id)}
            >
              Delete
            </button>
          </>
        )}
      />
    </div>
  );
}

export default Products;