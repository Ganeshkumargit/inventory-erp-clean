const pool = require("../config/db");

const getInventoryReport = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          p.product_id,
          p.product_name,
          c.category_name,
          p.price,
          p.stock_qty,
          (p.price * p.stock_qty) AS stock_value
       FROM products p
       LEFT JOIN categories c ON c.category_id = p.category_id
       WHERE p.status = 1
       ORDER BY p.product_name`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch inventory report",
      error: error.message,
    });
  }
};

module.exports = {
  getInventoryReport,
};