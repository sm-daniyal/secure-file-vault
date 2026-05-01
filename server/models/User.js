// ============================================================
// models/User.js — Mongoose schema for registered users
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Store only the hashed password — never plain text
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Pre-save hook: hash the password before storing it in the DB
userSchema.pre("save", async function (next) {
  // Only re-hash if the password field was modified (e.g. during registration or reset)
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10); // 10 rounds is a good balance of speed vs. security
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: compare a plain-text password against the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
