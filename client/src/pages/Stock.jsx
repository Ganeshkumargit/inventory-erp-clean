import { useEffect, useState } from "react";

import PageHeader from "../common/PageHeader";
import DataTable from "../common/DataTable";
import SearchBox from "../common/SearchBox";
import LoadingSpinner from "../common/LoadingSpinner";

import stockService from "../services/stockService";

function Stock() {
  const [stockHistory, setStockHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStockHistory = async () => {
    try {
      setLoading(true);
      const res = await stockService.getStockHistory();
      setStockHistory(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockHistory();
  }, []);

  const columns = [
    { key: "product_name", label: "Product" },
    { key: "category_name", label: "Category" },
    { key: "transaction_type", label: "Type" },
    { key: "quantity", label: "Quantity" },
    { key: "remarks", label: "Remarks" },
    {
      key: "created_at",
      label: "Date",
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
  ];

  const filteredStock = stockHistory.filter((stock) =>
    `${stock.product_name} ${stock.category_name} ${stock.transaction_type} ${stock.remarks}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Stock History"
        subtitle="View all inventory stock movements"
      />

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="Search stock history..."
      />

      {loading ? (
        <LoadingSpinner message="Loading stock history..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredStock}
          emptyMessage="No stock history found"
        />
      )}
    </div>
  );
}

export default Stock;