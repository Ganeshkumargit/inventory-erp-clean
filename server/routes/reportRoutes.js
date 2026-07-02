const express = require("express");
const verifyToken = require("../middleware/authMiddleware");

const { getInventoryReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/inventory", verifyToken, getInventoryReport);

module.exports = router;