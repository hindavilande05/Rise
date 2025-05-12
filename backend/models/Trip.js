// models/Trip.js
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start: {
    lat: Number,
    lon: Number,
    address: String,
  },
  destination: {
    lat: Number,
    lon: Number,
    address: String,
  },
  routeCoords: [
    {
      lat: Number,
      lon: Number,
    },
  ],
  stations: [
    {
      poi: {
        name: String,
        rating: Number,
      },
      address: {
        freeformAddress: String,
      },
      position: {
        lat: Number,
        lon: Number,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Trip', tripSchema);
