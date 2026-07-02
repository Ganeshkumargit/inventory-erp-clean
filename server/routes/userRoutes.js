const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getUsers,
  createUser,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("ADMIN"), getUsers);
router.post("/", verifyToken, authorizeRoles("ADMIN"), createUser);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateUser);

module.exports = router;