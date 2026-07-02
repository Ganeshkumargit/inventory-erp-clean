const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("ADMIN"), addSupplier);
router.get("/", verifyToken, getSuppliers);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateSupplier);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteSupplier);

module.exports = router;