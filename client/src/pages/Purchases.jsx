import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../common/PageHeader";
import FormCard from "../common/FormCard";
import DataTable from "../common/DataTable";
import SearchBox from "../common/SearchBox";
import LoadingSpinner from "../common/LoadingSpinner";

import supplierService from "../services/supplierService";
import productService from "../services/productService";
import purchaseService from "../services/purchaseService";

function Purchases() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    supplier_id: "",
    invoice_no: "",
    purchase_date: new Date().toISOString().slice(0, 10),
    remarks: "",
  });

  const [items, setItems] = useState([
    {
      product_id: "",
      quantity: 1,
      price: 0,
    },
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [supplierRes, productRes, purchaseRes] = await Promise.all([
        supplierService.getSuppliers(),
        productService.getProducts(),
        purchaseService.getPurchases(),
      ]);

      setSuppliers(supplierRes.data);
      setProducts(productRes.data);
      setPurchases(purchaseRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { key: "invoice_no", label: "Invoice No" },
    { key: "supplier_name", label: "Supplier" },
    {
      key: "purchase_date",
      label: "Purchase Date",
      render: (row) => new Date(row.purchase_date).toLocaleDateString(),
    },
    {
      key: "total_amount",
      label: "Total Amount",
      render: (row) => `₹${row.total_amount}`,
    },
  ];

  const filteredPurchases = purchases.filter((purchase) =>
    `${purchase.invoice_no} ${purchase.supplier_name} ${purchase.total_amount}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const grandTotal = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    updatedItems[index][field] = value;

    if (field === "product_id") {
      const selectedProduct = products.find(
        (product) => product.product_id === Number(value)
      );

      if (selectedProduct) {
        updatedItems[index].price = selectedProduct.price || 0;
      }
    }

    setItems(updatedItems);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        product_id: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) {
      toast.warning("At least one product is required");
      return;
    }

    setItems(items.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setForm({
      supplier_id: "",
      invoice_no: "",
      purchase_date: new Date().toISOString().slice(0, 10),
      remarks: "",
    });

    setItems([
      {
        product_id: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validItems = items.filter(
      (item) => item.product_id && Number(item.quantity) > 0
    );

    if (validItems.length === 0) {
      toast.error("Please add at least one valid product");
      return;
    }

    try {
      await purchaseService.addPurchase({
        ...form,
        items: validItems,
      });

      toast.success("Purchase saved successfully");

      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save purchase");
    }
  };

  return (
    <div>
      <PageHeader
        title="Purchase Management"
        subtitle="Create purchase entries and automatically update stock"
      />

      <FormCard title="Add Purchase">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Supplier</label>
              <select
                name="supplier_id"
                className="form-control"
                value={form.supplier_id}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Supplier</option>

                {suppliers.map((supplier) => (
                  <option key={supplier.supplier_id} value={supplier.supplier_id}>
                    {supplier.supplier_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Invoice No</label>
              <input
                type="text"
                name="invoice_no"
                className="form-control"
                value={form.invoice_no}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Purchase Date</label>
              <input
                type="date"
                name="purchase_date"
                className="form-control"
                value={form.purchase_date}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Grand Total</label>
              <input
                type="text"
                className="form-control"
                value={`₹${grandTotal}`}
                readOnly
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Remarks</label>
              <textarea
                name="remarks"
                className="form-control"
                rows="2"
                value={form.remarks}
                onChange={handleFormChange}
              ></textarea>
            </div>
          </div>

          <hr />

          <h6>Purchase Items</h6>

          {items.map((item, index) => (
            <div className="row align-items-end mb-2" key={index}>
              <div className="col-md-4">
                <label className="form-label">Product</label>
                <select
                  className="form-control"
                  value={item.product_id}
                  onChange={(e) =>
                    handleItemChange(index, "product_id", e.target.value)
                  }
                  required
                >
                  <option value="">Select Product</option>

                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.product_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Qty</label>
                <input
                  type="number"
                  className="form-control"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  min="1"
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", e.target.value)
                  }
                  min="0"
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Total</label>
                <input
                  type="text"
                  className="form-control"
                  value={Number(item.quantity || 0) * Number(item.price || 0)}
                  readOnly
                />
              </div>

              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeItemRow(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary mt-2" onClick={addItemRow}>
            + Add Product
          </button>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary">
              Save Purchase
            </button>
          </div>
        </form>
      </FormCard>

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="Search purchases..."
      />

      {loading ? (
        <LoadingSpinner message="Loading purchases..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredPurchases}
          emptyMessage="No purchases found"
        />
      )}
    </div>
  );
}

export default Purchases;