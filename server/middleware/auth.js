// ============================================================
// middleware/auth.js — JWT authentication middleware
// ============================================================
// Attach this to any route that requires a logged-in user.
// It reads the token from the Authorization header, verifies it,
// and adds the decoded user payload to req.user.
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Tokens are sent as:  Authorization: Bearer <token>
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized — no token provided" });
  }

  try {
    // Verify signature and expiry; throws if invalid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user document (minus the password) to the request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next(); // all good — proceed to the route handler
  } catch (err) {
    return res.status(401).json({ message: "Not authorized — invalid token" });
  }
};

module.exports = protect;
