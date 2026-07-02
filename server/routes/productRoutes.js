const express = require("express");
const multer = require("multer");
const path = require("path");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", verifyToken, authorizeRoles("ADMIN"), upload.single("image"), addProduct);
router.get("/", verifyToken, getProducts);
router.get("/:id", verifyToken, getProductById);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteProduct);

module.exports = router;