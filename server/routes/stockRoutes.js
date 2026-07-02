const express = require("express");
const verifyToken = require("../middleware/authMiddleware");

const { getStockHistory } = require("../controllers/stockController");

const router = express.Router();

router.get("/", verifyToken, getStockHistory);

module.exports = router;