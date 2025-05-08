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

//get upcoming booking of specific user
// exports.getUserBookings = async (req, res) => {
//   try {
//     const userId = req.user._id;  
    
//     const bookings = await Booking.find({ userId, status: 'upcoming' })
//       .populate('stationId', 'name address');
    
//     res.json(bookings);
//   } catch (error) {
//     console.error("Error fetching user bookings:", error);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const statusParam = req.query.status || 'upcoming';

    const statuses = statusParam.split(',');

    const bookings = await Booking.find({
      userId,
      status: { $in: statuses }
    }).populate('stationId', 'name address');

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ msg: "Server error" });
  }
};



//get a particular booking by booking ID
// controllers/bookingController.js
exports.getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    
    const booking = await Booking.findById(bookingId).populate("stationId");
    // if (!booking) {
    //   return res.status(404).json({ message: 'Booking not found' });
    // }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


//cancle booking

exports.cancelBooking = async (req, res) => {
  const  bookingId  = req.params.bookingId;
 
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
