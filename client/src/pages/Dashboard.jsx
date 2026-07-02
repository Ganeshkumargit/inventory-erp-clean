import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import PageHeader from "../common/PageHeader";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../common/LoadingSpinner";

import dashboardService from "../services/dashboardService";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    totalPurchases: 0,
    totalStock: 0,
    lowStockProducts: 0,
    recentProducts: [],
    recentPurchases: [],
    purchaseTrend: [],
    categoryDistribution: [],
  });

  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      setStats(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartColors = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1"];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Live overview of your inventory ERP"
      />

      <div className="alert alert-success">
        Welcome, {user?.name} | Role: {user?.role}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading dashboard..." />
      ) : (
        <>
          <div className="row mt-4">
            <div className="col-md-3 mb-3">
              <StatCard title="Products" value={stats.totalProducts} />
            </div>

            <div className="col-md-3 mb-3">
              <StatCard title="Categories" value={stats.totalCategories} />
            </div>

            <div className="col-md-3 mb-3">
              <StatCard title="Suppliers" value={stats.totalSuppliers} />
            </div>

            <div className="col-md-3 mb-3">
              <StatCard title="Purchases" value={stats.totalPurchases} />
            </div>

            <div className="col-md-3 mb-3">
              <StatCard title="Total Stock" value={stats.totalStock} />
            </div>

            <div className="col-md-3 mb-3">
              <StatCard title="Low Stock" value={stats.lowStockProducts} />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-8 mb-3">
              <div className="card shadow">
                <div className="card-header fw-bold">
                  Purchase Trend
                </div>

                <div className="card-body" style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.purchaseTrend}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#0d6efd"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card shadow">
                <div className="card-header fw-bold">
                  Category Distribution
                </div>

                <div className="card-body" style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.categoryDistribution}
                        dataKey="product_count"
                        nameKey="category_name"
                        outerRadius={90}
                        label
                      >
                        {stats.categoryDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <div className="card shadow">
                <div className="card-header fw-bold">Recent Products</div>

                <div className="card-body">
                  {stats.recentProducts.length === 0 ? (
                    <p className="text-muted">No recent products</p>
                  ) : (
                    <ul className="list-group">
                      {stats.recentProducts.map((item, index) => (
                        <li
                          className="list-group-item d-flex justify-content-between"
                          key={index}
                        >
                          <span>{item.product_name}</span>
                          <span>Stock: {item.stock_qty}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="card shadow">
                <div className="card-header fw-bold">Recent Purchases</div>

                <div className="card-body">
                  {stats.recentPurchases.length === 0 ? (
                    <p className="text-muted">No recent purchases</p>
                  ) : (
                    <ul className="list-group">
                      {stats.recentPurchases.map((item, index) => (
                        <li
                          className="list-group-item d-flex justify-content-between"
                          key={index}
                        >
                          <span>
                            {item.invoice_no} - {item.supplier_name}
                          </span>
                          <span>₹{item.total_amount}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;