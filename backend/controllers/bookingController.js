// controllers/bookingController.js
const Booking = require('../models/Booking');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      stationId,
      vehicleType,
      vehicleModel,
      connectionType,
      date,
      time,
      amount,
    } = req.body;

    const estimatedKwh = amount / 10;

    const booking = new Booking({
      userId,
      stationId,
      vehicleType,
      vehicleModel,
      connectionType,
      date,
      time,
      amount,
      estimatedKwh,
    });

    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
  }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).populate('stationId');
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
  }
};

//not working yet
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('stationId'); 
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};