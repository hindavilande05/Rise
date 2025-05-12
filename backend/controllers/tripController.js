const Trip = require('../models/Trip');


exports.addTrip = async (req, res) => {
  try {
    const userId = req.user._id;  
    const { start, destination, routeCoords, stations } = req.body;

    const trip = new Trip({
      user: userId,         
      start,
      destination,
      routeCoords,
      stations,
    });


    const savedTrip = await trip.save();

    res.status(201).json({ success: true, trip: savedTrip });
  } catch (err) {
 
    console.error('Error saving trip:', err);
    res.status(500).json({ success: false, message: 'Server error while saving trip', error: err.message });
  }
};


exports.getTripsByUser = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error: Unable to fetch trips' });
  }
};
