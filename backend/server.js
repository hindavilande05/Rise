const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require("./routes/userRoutes");




require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

// Routes
app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);



// Start Server
const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
