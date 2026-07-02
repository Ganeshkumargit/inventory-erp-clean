const express = require("express");
const multer = require("multer");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  uploadDocument,
  getDocuments,
  getDocumentDownloadUrl,
  deleteDocument,
} = require("../controllers/documentController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/",
  verifyToken,
  authorizeRoles("ADMIN"),
  upload.single("file"),
  uploadDocument
);

router.get("/", verifyToken, getDocuments);

router.get("/:id/download-url", verifyToken, getDocumentDownloadUrl);

router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteDocument);

module.exports = router;