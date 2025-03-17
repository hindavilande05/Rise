const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getUserProfile } = require("../controllers/userController");

// 🔹 GET: Fetch User Profile (Protected Route)
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
