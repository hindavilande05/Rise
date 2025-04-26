const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  connectionType: {
    type: String,
    enum: ['AC', 'DC', 'Type2', 'CCS', 'CHAdeMO'],
    required: true,
  },
  date: {
    type: String, 
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  estimatedKwh: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
