const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const products = await pool.query(
      "SELECT COUNT(*) FROM products WHERE status = 1"
    );

    const categories = await pool.query(
      "SELECT COUNT(*) FROM categories WHERE status = 1"
    );


    const purchaseTrend = await pool.query(
  `SELECT 
      TO_CHAR(purchase_date, 'Mon YYYY') AS month,
      SUM(total_amount) AS total
   FROM purchases
   WHERE status = 1
   GROUP BY TO_CHAR(purchase_date, 'Mon YYYY'), DATE_TRUNC('month', purchase_date)
   ORDER BY DATE_TRUNC('month', purchase_date)
   LIMIT 6`
);

const categoryDistribution = await pool.query(
  `SELECT 
      c.category_name,
      COUNT(p.product_id) AS product_count
   FROM categories c
   LEFT JOIN products p 
      ON p.category_id = c.category_id 
      AND p.status = 1
   WHERE c.status = 1
   GROUP BY c.category_name
   ORDER BY product_count DESC`
);


    const suppliers = await pool.query(
      "SELECT COUNT(*) FROM suppliers WHERE status = 1"
    );

    const purchases = await pool.query(
      "SELECT COUNT(*) FROM purchases WHERE status = 1"
    );

    const totalStock = await pool.query(
      "SELECT COALESCE(SUM(stock_qty), 0) FROM products WHERE status = 1"
    );

    const lowStock = await pool.query(
      "SELECT COUNT(*) FROM products WHERE status = 1 AND stock_qty <= 5"
    );

    const recentProducts = await pool.query(
  `SELECT product_name, stock_qty, created_at
   FROM products
   WHERE status = 1
   ORDER BY product_id DESC
   LIMIT 5`
);

const recentPurchases = await pool.query(
  `SELECT p.invoice_no, s.supplier_name, p.total_amount, p.created_at
   FROM purchases p
   LEFT JOIN suppliers s ON s.supplier_id = p.supplier_id
   WHERE p.status = 1
   ORDER BY p.purchase_id DESC
   LIMIT 5`
);


res.json({
  totalProducts: Number(products.rows[0].count),
  totalCategories: Number(categories.rows[0].count),
  totalSuppliers: Number(suppliers.rows[0].count),
  totalPurchases: Number(purchases.rows[0].count),
  totalStock: Number(totalStock.rows[0].coalesce),
  lowStockProducts: Number(lowStock.rows[0].count),
  recentProducts: recentProducts.rows,
  recentPurchases: recentPurchases.rows,
  purchaseTrend: purchaseTrend.rows,
categoryDistribution: categoryDistribution.rows,
});
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};