const pool = require("../config/db");

const addCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    const result = await pool.query(
      `INSERT INTO categories (category_name)
       VALUES ($1)
       RETURNING *`,
      [category_name]
    );

    res.status(201).json({
      message: "Category added successfully",
      category: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add category",
      error: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM categories
       WHERE status = 1
       ORDER BY category_id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM categories
       WHERE category_id = $1 AND status = 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    const result = await pool.query(
      `UPDATE categories
       SET category_name = $1
       WHERE category_id = $2 AND status = 1
       RETURNING *`,
      [category_name, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category updated successfully",
      category: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE categories
       SET status = 0
       WHERE category_id = $1 AND status = 1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};