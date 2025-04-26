const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require("./routes/userRoutes");
const bookingsRoute = require('./routes/bookings');
const stationRoutes = require('./routes/stations');

require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

// Routes
app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/stations", stationRoutes); 
app.use('/api/bookings', bookingsRoute);


// Start Server
const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
