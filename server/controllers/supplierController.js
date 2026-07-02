const pool = require("../config/db");

const addSupplier = async (req, res) => {
  try {
    const { supplier_name, mobile, email, address } = req.body;

    const result = await pool.query(
      `INSERT INTO suppliers (supplier_name, mobile, email, address)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [supplier_name, mobile, email, address]
    );

    res.status(201).json({
      message: "Supplier added successfully",
      supplier: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add supplier",
      error: error.message,
    });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM suppliers
       WHERE status = 1
       ORDER BY supplier_id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch suppliers",
      error: error.message,
    });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier_name, mobile, email, address } = req.body;

    const result = await pool.query(
      `UPDATE suppliers
       SET supplier_name = $1,
           mobile = $2,
           email = $3,
           address = $4
       WHERE supplier_id = $5 AND status = 1
       RETURNING *`,
      [supplier_name, mobile, email, address, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json({
      message: "Supplier updated successfully",
      supplier: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update supplier",
      error: error.message,
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE suppliers
       SET status = 0
       WHERE supplier_id = $1 AND status = 1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete supplier",
      error: error.message,
    });
  }
};

module.exports = {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
};