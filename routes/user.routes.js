const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");  
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/user.controller");

// Route for user registration
router.post("/register", registerUser);
// Route for user login
router.post("/login", loginUser);
// Route for getting user profile (protected route)
router.get("/profile", authenticate, getUserProfile);

module.exports = router;
