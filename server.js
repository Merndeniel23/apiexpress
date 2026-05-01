// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

const app = express();

// 🟢 Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// 🟢 Root route (for testing)
app.get('/', (req, res) => {
  res.send('API is running');
});

// 🟢 API Routes
app.use("/api/auth", require("./routes/authRoutes")); // Auth routes
app.use("/api/items", require("./routes/itemRoutes")); // Items routes

// 🟢 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// 🟢 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));