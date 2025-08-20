// controllers/authController.js - CORRECTED VERSION
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TempUser = require("../models/TempUser");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // ✅ Add input validation
  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: "Name, email, and password are required" 
    });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ 
      message: "Name must be at least 2 characters long" 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // ✅ Check both User and TempUser collections
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Check if there's already a pending registration
    const existingTempUser = await TempUser.findOne({ email });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingTempUser) {
      // ✅ Update existing temp user instead of creating new one
      existingTempUser.name = name.trim(); // ✅ Ensure name is trimmed
      existingTempUser.password = hashedPassword;
      existingTempUser.otp = otp;
      existingTempUser.createdAt = new Date(); // Reset TTL
      await existingTempUser.save();
    } else {
      // ✅ Create new temp user with proper field assignment
      const tempUser = new TempUser({
        name: name.trim(), // ✅ Ensure name is trimmed
        email: email.toLowerCase().trim(), // ✅ Normalize email
        password: hashedPassword,
        otp,
      });
      await tempUser.save();
    }

    // ✅ FIXED: createTransport instead of createTransporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"PassGuard" <${process.env.EMAIL}>`,
      to: email,
      subject: "Verify Your PassGuard Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6366f1; margin: 0; font-size: 28px;">🛡️ PassGuard</h1>
            </div>
            <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to PassGuard!</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Thank you for joining PassGuard! Your verification code is:</p>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0;">
              <h1 style="color: white; font-size: 36px; margin: 0; letter-spacing: 8px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${otp}</h1>
            </div>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">This code will expire in <strong style="color: #ef4444;">5 minutes</strong>.</p>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">If you didn't create an account, please ignore this email.</p>
            <hr style="border: none; height: 1px; background: #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px; text-align: center;">Best regards,<br><strong>The PassGuard Team</strong></p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ 
      message: "Verification code sent to your email",
      email: email 
    });
    
  } catch (err) {
    console.error("Registration error:", err);
    
    // ✅ Better error handling
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation failed", 
        details: err.message 
      });
    }
    
    res.status(500).json({ message: "Failed to send verification code" });
  }
};

exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // ✅ Find temp user in database
    const tempUser = await TempUser.findOne({ email: email.toLowerCase().trim() });
    
    if (!tempUser) {
      return res.status(400).json({ 
        message: "No pending registration found for this email" 
      });
    }

    // ✅ Check rate limit
    const timeSinceCreation = Date.now() - tempUser.createdAt.getTime();
    if (timeSinceCreation < 60 * 1000) { // 1 minute cooldown
      return res.status(429).json({ 
        message: "Please wait a minute before requesting a new code" 
      });
    }

    // ✅ Generate new OTP and update temp user
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    tempUser.otp = newOtp;
    tempUser.createdAt = new Date(); // Reset TTL
    await tempUser.save();

    // ✅ FIXED: createTransport instead of createTransporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"PassGuard" <${process.env.EMAIL}>`,
      to: email,
      subject: "Your New PassGuard Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6366f1; margin: 0; font-size: 28px;">🛡️ PassGuard</h1>
            </div>
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Verification Code</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi <strong>${tempUser.name}</strong>,</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Your new verification code is:</p>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0;">
              <h1 style="color: white; font-size: 36px; margin: 0; letter-spacing: 8px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${newOtp}</h1>
            </div>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">This code will expire in <strong style="color: #ef4444;">5 minutes</strong>.</p>
            <hr style="border: none; height: 1px; background: #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px; text-align: center;">Best regards,<br><strong>The PassGuard Team</strong></p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ message: "New verification code sent to your email" });
    
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Failed to resend verification code" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    // ✅ Find temp user in database
    const tempUser = await TempUser.findOne({ email: email.toLowerCase().trim() });
    
    if (!tempUser) {
      return res.status(400).json({ 
        message: "No pending registration found for this email" 
      });
    }

    // ✅ Verify OTP
    if (tempUser.otp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // ✅ Check if temp user expired
    const timeSinceCreation = Date.now() - tempUser.createdAt.getTime();
    if (timeSinceCreation > 5 * 60 * 1000) { // 5 minutes
      await TempUser.deleteOne({ email: email.toLowerCase().trim() });
      return res.status(400).json({ message: "Verification code expired" });
    }

    // ✅ Check again if user was created in the meantime
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      await TempUser.deleteOne({ email: email.toLowerCase().trim() });
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create actual user
    const newUser = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password, // Already hashed
    });
    
    await newUser.save();
    
    // ✅ Clean up temp user
    await TempUser.deleteOne({ email: email.toLowerCase().trim() });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      message: "Account verified successfully! Welcome to PassGuard!",
      token,
      user: { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email 
      }
    });
    
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Error verifying account" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
