const pool = require("../config/db");
const s3 = require("../config/s3");

const {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const addProduct = async (req, res) => {
  try {
    const { category_id, product_name, description, price, stock_qty } = req.body;

    let image_path = null;
    let image_s3_key = null;

    if (req.file) {
      const s3Key = `products/${Date.now()}-${req.file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: s3Key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );

      image_s3_key = s3Key;
      image_path = s3Key;
    }

    const result = await pool.query(
      `INSERT INTO products
       (category_id, product_name, description, price, stock_qty, image_path, image_s3_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        category_id,
        product_name,
        description,
        price,
        stock_qty || 0,
        image_path,
        image_s3_key,
      ]
    );

    res.status(201).json({
      message: "Product added successfully",
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          p.product_id,
          p.category_id,
          c.category_name,
          p.product_name,
          p.description,
          p.price,
          p.stock_qty,
          p.image_path,
          p.image_s3_key,
          p.created_at
       FROM products p
       LEFT JOIN categories c ON c.category_id = p.category_id
       WHERE p.status = 1
       ORDER BY p.product_id DESC`
    );

    const products = await Promise.all(
      result.rows.map(async (product) => {
        if (product.image_s3_key) {
          const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: product.image_s3_key,
          });

          product.image_path = await getSignedUrl(s3, command, {
            expiresIn: 60 * 5,
          });
        }

        return product;
      })
    );

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM products
       WHERE product_id = $1 AND status = 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const product = result.rows[0];

    if (product.image_s3_key) {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: product.image_s3_key,
      });

      product.image_path = await getSignedUrl(s3, command, {
        expiresIn: 60 * 5,
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, product_name, description, price, stock_qty } = req.body;

    const existingResult = await pool.query(
      `SELECT image_s3_key
       FROM products
       WHERE product_id = $1 AND status = 1`,
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let image_s3_key = existingResult.rows[0].image_s3_key || null;
    let image_path = image_s3_key;

    if (req.file) {
      if (image_s3_key) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: image_s3_key,
          })
        );
      }

      const s3Key = `products/${Date.now()}-${req.file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: s3Key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );

      image_s3_key = s3Key;
      image_path = s3Key;
    }

    const result = await pool.query(
      `UPDATE products
       SET category_id = $1,
           product_name = $2,
           description = $3,
           price = $4,
           stock_qty = $5,
           image_path = $6,
           image_s3_key = $7
       WHERE product_id = $8 AND status = 1
       RETURNING *`,
      [
        category_id,
        product_name,
        description,
        price,
        stock_qty || 0,
        image_path,
        image_s3_key,
        id,
      ]
    );

    res.json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingResult = await pool.query(
      `SELECT image_s3_key
       FROM products
       WHERE product_id = $1 AND status = 1`,
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const image_s3_key = existingResult.rows[0].image_s3_key;

    if (image_s3_key) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: image_s3_key,
        })
      );
    }

    await pool.query(
      `UPDATE products
       SET status = 0
       WHERE product_id = $1 AND status = 1`,
      [id]
    );

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};