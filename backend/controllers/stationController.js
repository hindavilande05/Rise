const Station = require('../models/Station');

const createStation = async (req, res) => {
  try {
    const {
      name,
      address,
      location,
      connectorTypes,
      ratedPowerKW,
      pricePerKwh,
    } = req.body;

    const existingStation = await Station.findOne({
      name,
      'location.latitude': location.latitude,
      'location.longitude': location.longitude,
    });

    if (existingStation) {
      return res.status(200).json(existingStation);
    }


    const newStation = new Station({
      name,
      address,
      location,
      connectorTypes,
      ratedPowerKW,
      pricePerKwh,
    });

    const savedStation = await newStation.save();
    res.status(201).json(savedStation);
  } catch (error) {
    console.error('Error creating station:', error);
    res.status(500).json({ message: 'Server error creating station' });
  }
};

const getStations = async (req, res) => {
  try {
    const { name, latitude, longitude } = req.query; 

    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' }; 
    }
    
    if (latitude && longitude) {
      filter['location.latitude'] = parseFloat(latitude);
      filter['location.longitude'] = parseFloat(longitude);
    }

    const stations = await Station.find(filter);
    if (stations.length === 0) {
      return res.status(200).json({ success: true, message: 'No stations found', stations: [] });
    }
      
    return res.status(200).json({ success: true, stations });
    
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createStation,
  getStations
};
