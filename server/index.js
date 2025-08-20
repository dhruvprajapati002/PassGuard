const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const vaultRoutes = require("./routes/vaultRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);

// ✅ Fixed: Named wildcard for API 404s
app.use('/api/*path', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// ✅ Fixed: Named wildcard for all other 404s
app.use('/*path', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page not found'
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error: ", err));

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
