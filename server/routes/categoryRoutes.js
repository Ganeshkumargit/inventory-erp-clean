const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("ADMIN"), addCategory);
router.get("/", verifyToken, getCategories);
router.get("/:id", verifyToken, getCategoryById);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateCategory);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteCategory);

module.exports = router;