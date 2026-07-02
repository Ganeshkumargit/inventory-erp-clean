const pool = require("../config/db");

const addProduct = async (req, res) => {
  try {
    const { category_id, product_name, description, price, stock_qty } = req.body;

    const image_path = req.file ? `/uploads/products/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO products
       (category_id, product_name, description, price, stock_qty, image_path)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [category_id, product_name, description, price, stock_qty || 0, image_path]
    );

    res.status(201).json({
      message: "Product added successfully",
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          p.product_id,
          p.category_id,
          c.category_name,
          p.product_name,
          p.description,
          p.price,
          p.stock_qty,
          p.image_path,
          p.created_at
       FROM products p
       LEFT JOIN categories c ON c.category_id = p.category_id
       WHERE p.status = 1
       ORDER BY p.product_id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM products
       WHERE product_id = $1 AND status = 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, product_name, description, price, stock_qty } = req.body;

    let image_path = req.body.old_image_path || null;

    if (req.file) {
      image_path = `/uploads/products/${req.file.filename}`;
    }

    const result = await pool.query(
      `UPDATE products
       SET category_id = $1,
           product_name = $2,
           description = $3,
           price = $4,
           stock_qty = $5,
           image_path = $6
       WHERE product_id = $7 AND status = 1
       RETURNING *`,
      [category_id, product_name, description, price, stock_qty || 0, image_path, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE products
       SET status = 0
       WHERE product_id = $1 AND status = 1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};