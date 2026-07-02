const pool = require("../config/db");
const s3 = require("../config/s3");
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");
const path = require("path");

const uploadDocument = async (req, res) => {
  try {
    const { title, storage_type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    let filePath = "";
    let s3Key = null;
    let finalStorageType = storage_type || "LOCAL";

    if (finalStorageType === "AWS_S3") {
      s3Key = `documents/${Date.now()}-${file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      filePath = s3Key;
    } else {
      const uploadDir = path.join(__dirname, "../uploads/documents");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;

      const localPath = path.join(uploadDir, uniqueName);

      fs.writeFileSync(localPath, file.buffer);

      filePath = `/uploads/documents/${uniqueName}`;
      finalStorageType = "LOCAL";
    }

    const result = await pool.query(
      `INSERT INTO documents
       (title, file_name, file_path, file_type, storage_type, s3_key)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, file.originalname, filePath, file.mimetype, finalStorageType, s3Key]
    );

    res.status(201).json({
      message: "Document uploaded successfully",
      document: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

const getDocuments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM documents
       WHERE status = 1
       ORDER BY document_id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

const getDocumentDownloadUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM documents
       WHERE document_id = $1 AND status = 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    const doc = result.rows[0];

    if (doc.storage_type === "LOCAL") {
      return res.json({
        url: `${req.protocol}://${req.get("host")}${doc.file_path}`,
      });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: doc.s3_key,
      ResponseContentDisposition: `attachment; filename="${doc.file_name}"`,
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5,
    });

    res.json({ url: signedUrl });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate download URL",
      error: error.message,
    });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM documents
       WHERE document_id = $1 AND status = 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const doc = result.rows[0];

    if (doc.storage_type === "AWS_S3" && doc.s3_key) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: doc.s3_key,
        })
      );
    }

    if (doc.storage_type === "LOCAL" && doc.file_path) {
      const localFilePath = path.join(__dirname, "..", doc.file_path);

      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    }

    await pool.query(
      `UPDATE documents
       SET status = 0
       WHERE document_id = $1`,
      [id]
    );

    res.json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete document",
      error: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentDownloadUrl,
  deleteDocument,
};