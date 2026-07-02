const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const documentRoutes = require("./routes/documentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const stockRoutes = require("./routes/stockRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/documents", documentRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/products", productRoutes);

app.use("/api/suppliers", supplierRoutes);

app.use("/api/purchases", purchaseRoutes);

app.use("/api/stock", stockRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Inventory ERP API Running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});


app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "You accessed protected API successfully",
    user: req.user,
  });
});


app.get(
  "/api/admin-only",
  verifyToken,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({
      message: "Welcome Admin. You have access.",
      user: req.user,
    });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});