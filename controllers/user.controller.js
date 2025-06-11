const UserService = require("../services/user.service");

exports.registerUser = async (req, res) => {
  try {
    const result = await UserService.registerUser(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(error.status || 500).json({ message: error.message || "Server error during registration" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const result = await UserService.loginUser(req.body);
    res.status(200).json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(error.status || 500).json({ message: error.message || "Server error during login" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const profile = await UserService.getUserProfile(req.user.userId);
    res.status(200).json({
      message: "User profile retrieved successfully",
      user: profile,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(error.status || 500).json({ message: error.message || "Server error fetching profile" });
  }
};
