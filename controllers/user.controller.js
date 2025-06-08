const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Email validation regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Validate required fields
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Validate email format using regex
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists by username
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if user already exists by email
    existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate salt for password hashing (10 rounds)
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user instance with hashed password
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    // Save the new user to database
    await newUser.save();

    // Generate JWT token for the newly registered user
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Send success response with user data (excluding password) and token
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    // Log error for debugging purposes
    console.error("Error registering user:", error);

    // Send generic server error response
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate required fields
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }

    // Find user by username in database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token for authenticated user
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send success response with user data (excluding password) and token
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    // Log error for debugging purposes
    console.error("Error logging in user:", error);

    // Send generic server error response
    return res.status(500).json({ message: "Server error during login" });
  }
};

// Get user profile (protected route)
exports.getUserProfile = async (req, res) => {
  try {
    // Get user ID from JWT token (set by auth middleware)
    const userId = req.user.userId;

    // Find user by ID and exclude password from response
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user profile data
    res.status(200).json({
      message: "User profile retrieved successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    // Log error for debugging purposes
    console.error("Error fetching user profile:", error);

    // Send generic server error response
    return res.status(500).json({ message: "Server error fetching profile" });
  }
};
