// cron/bookingStatusCron.js
const cron = require("node-cron");
const Booking = require("../models/Booking");

const updateExpiredBookings = async () => {
  try {
    const now = new Date();
    const bookings = await Booking.find({ status: "upcoming" });

    for (let booking of bookings) {
      const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
      if (bookingDateTime < now) {
        booking.status = "completed";
        await booking.save();
        console.log(`Updated booking ${booking._id} to completed`);
      }
    }
  } catch (error) {
    console.error("Cron error while updating booking statuses:", error);
  }
};

// Run every 30 minutes
cron.schedule("*/30 * * * *", () => {
  console.log("Running booking status update cron...");
  updateExpiredBookings();
});
