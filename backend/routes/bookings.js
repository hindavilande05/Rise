const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');


router.post('/', bookingController.createBooking);

//all bookings for a user
router.get('/:userId', bookingController.getUserBookings);

// Get a booking by ID - not working yet
router.get('/:id', bookingController.getBookingById); 

module.exports = router;
