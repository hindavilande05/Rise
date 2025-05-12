const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require("./routes/userRoutes");
const bookingsRoute = require('./routes/bookings');
const stationRoutes = require('./routes/stations');
const  recommend = require('./routes/recommend');
const tripRoutes = require("./routes/tripRoutes");


require("dotenv").config();

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

//Cron job to update booking status
require("./cron/bookingStatusCron");

//recommendation route
app.use('/api', recommend);

// Routes
app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/stations", stationRoutes); 
app.use('/api/bookings', bookingsRoute);

app.use('/api/trips', tripRoutes);





// Start Server
const PORT = process.env.PORT || 10000;
connectDB();
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
