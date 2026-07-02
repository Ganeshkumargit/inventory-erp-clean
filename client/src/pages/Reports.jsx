import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PageHeader from "../common/PageHeader";
import DataTable from "../common/DataTable";
import SearchBox from "../common/SearchBox";
import LoadingSpinner from "../common/LoadingSpinner";

import reportService from "../services/reportService";

function Reports() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchInventoryReport = async () => {
    try {
      setLoading(true);
      const res = await reportService.getInventoryReport();
      setInventory(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryReport();
  }, []);

  const columns = [
    { key: "product_name", label: "Product" },
    { key: "category_name", label: "Category" },
    {
      key: "price",
      label: "Price",
      render: (row) => `₹${row.price}`,
    },
    { key: "stock_qty", label: "Stock" },
    {
      key: "stock_value",
      label: "Stock Value",
      render: (row) => `₹${row.stock_value}`,
    },
  ];

  const filteredInventory = inventory.filter((item) =>
    `${item.product_name} ${item.category_name} ${item.price} ${item.stock_qty}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const exportToExcel = () => {
  const exportData = filteredInventory.map((item, index) => ({
    SNo: index + 1,
    Product: item.product_name,
    Category: item.category_name,
    Price: item.price,
    Stock: item.stock_qty,
    StockValue: item.stock_value,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");

  XLSX.writeFile(workbook, "Inventory_Report.xlsx");
};


const exportToPDF = () => {
  const doc = new jsPDF();

  doc.text("Inventory Report", 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [["#", "Product", "Category", "Price", "Stock", "Stock Value"]],
    body: filteredInventory.map((item, index) => [
      index + 1,
      item.product_name,
      item.category_name,
      item.price,
      item.stock_qty,
      item.stock_value,
    ]),
  });

  doc.save("Inventory_Report.pdf");
};


  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Inventory reports and stock valuation"
      />

      <button className="btn btn-success mb-3" onClick={exportToExcel}>
  Export to Excel
</button>

<button className="btn btn-danger mb-3 ms-2" onClick={exportToPDF}>
  Export to PDF
</button>

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="Search inventory report..."
      />

      {loading ? (
        <LoadingSpinner message="Loading report..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredInventory}
          emptyMessage="No inventory report found"
        />
      )}
    </div>
  );
}

export default Reports;