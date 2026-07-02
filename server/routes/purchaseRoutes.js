const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  addPurchase,
  getPurchases,
} = require("../controllers/purchaseController");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("ADMIN"), addPurchase);
router.get("/", verifyToken, getPurchases);

module.exports = router;