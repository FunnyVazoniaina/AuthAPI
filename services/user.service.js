const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

 // Email validation regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class UserService {
  static async registerUser({ username, password, email }) {
    if (!username || !password || !email) {
      throw { status: 400, message: "Please provide all required fields" };
    }
    if (!emailRegex.test(email)) {
      throw { status: 400, message: "Invalid email format" };
    }
    if (password.length < 6) {
      throw {
        status: 400,
        message: "Password must be at least 6 characters long",
      };
    }

    let existingUser = await User.findOne({ username });
    if (existingUser) {
      throw { status: 400, message: "Username already exists" };
    }

    existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 400, message: "Email already registered" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    };
  }

  static async loginUser({ username, password }) {
    if (!username || !password) {
      throw { status: 400, message: "Please provide username and password" };
    }

    const user = await User.findOne({ username });
    if (!user) {
      throw { status: 400, message: "Invalid credentials" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { status: 400, message: "Invalid credentials" };
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  }

  static async getUserProfile(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw { status: 404, message: "User not found" };
    }
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

module.exports = UserService;
