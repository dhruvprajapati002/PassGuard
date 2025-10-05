// models/TempUser.js - Enhanced Version
const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  otpAttempts: { type: Number, default: 0, max: 3 },
  lastOtpSent: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // 5 mins TTL
});

// // Index for better performance
// tempUserSchema.index({ email: 1 });
// tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("TempUser", tempUserSchema);
