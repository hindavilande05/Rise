const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

const authMiddleware = require('../middleware/authMiddleware');


router.post('/', bookingController.createBooking);

// //all bookings for a user
// router.get('/:userId', bookingController.getUserBookings);

router.get('/', authMiddleware, bookingController.getUserBookings);

router.get('/getBookingById/:bookingId', bookingController.getBookingById);

router.put('/cancelBooking/:bookingId', bookingController.cancelBooking);

module.exports = router;
