// ============================================================
// controllers/authController.js — Register & Login logic
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: create a signed JWT that expires in 7 days
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ---------------------------------------------------------------
// POST /api/auth/register
// Body: { username, email, password }
// ---------------------------------------------------------------
const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email or username already taken
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "Username or email already in use" });
    }

    // Create user — password will be hashed by the pre-save hook in User model
    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: "Account created successfully",
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------------------------------------------------------
// POST /api/auth/login
// Body: { email, password }
// ---------------------------------------------------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    // Use a generic message to avoid leaking whether the email exists
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { register, login };
