const pool = require("../config/db");

const getStockHistory = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          sh.stock_id,
          sh.product_id,
          p.product_name,
          c.category_name,
          sh.transaction_type,
          sh.quantity,
          sh.remarks,
          sh.created_at
       FROM stock_history sh
       LEFT JOIN products p ON p.product_id = sh.product_id
       LEFT JOIN categories c ON c.category_id = p.category_id
       ORDER BY sh.stock_id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stock history",
      error: error.message,
    });
  }
};

module.exports = {
  getStockHistory,
};