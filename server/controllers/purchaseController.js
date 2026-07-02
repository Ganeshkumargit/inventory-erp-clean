const pool = require("../config/db");

const addPurchase = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { supplier_id, invoice_no, purchase_date, remarks, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Purchase items required" });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.price),
      0
    );

    const purchaseResult = await client.query(
      `INSERT INTO purchases
       (supplier_id, invoice_no, purchase_date, total_amount, remarks)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [supplier_id, invoice_no, purchase_date, totalAmount, remarks]
    );

    const purchase = purchaseResult.rows[0];

    for (const item of items) {
      const itemTotal = Number(item.quantity) * Number(item.price);

      await client.query(
        `INSERT INTO purchase_items
         (purchase_id, product_id, quantity, price, total)
         VALUES ($1, $2, $3, $4, $5)`,
        [purchase.purchase_id, item.product_id, item.quantity, item.price, itemTotal]
      );

      await client.query(
        `UPDATE products
         SET stock_qty = stock_qty + $1
         WHERE product_id = $2`,
        [item.quantity, item.product_id]
      );

      await client.query(
        `INSERT INTO stock_history
         (product_id, transaction_type, quantity, remarks)
         VALUES ($1, $2, $3, $4)`,
        [item.product_id, "PURCHASE", item.quantity, `Purchase Invoice: ${invoice_no}`]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Purchase saved successfully",
      purchase,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    res.status(500).json({
      message: "Failed to save purchase",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

const getPurchases = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          p.purchase_id,
          p.invoice_no,
          p.purchase_date,
          p.total_amount,
          p.remarks,
          p.created_at,
          s.supplier_name
       FROM purchases p
       LEFT JOIN suppliers s ON s.supplier_id = p.supplier_id
       WHERE p.status = 1
       ORDER BY p.purchase_id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch purchases",
      error: error.message,
    });
  }
};

module.exports = {
  addPurchase,
  getPurchases,
};