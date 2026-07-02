const pool = require("../config/db");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, name, email, role, mobile, is_active, created_at
       FROM users
       ORDER BY user_id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, mobile } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, mobile, is_active)
       VALUES ($1, $2, $3, $4, $5, 1)
       RETURNING user_id, name, email, role, mobile, is_active`,
      [name, email, hashedPassword, role || "STAFF", mobile]
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, mobile, is_active } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           role = $2,
           mobile = $3,
           is_active = $4
       WHERE user_id = $5
       RETURNING user_id, name, email, role, mobile, is_active`,
      [name, role, mobile, is_active, id]
    );

    res.json({
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
};