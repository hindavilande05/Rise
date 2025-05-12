const express = require('express');
const { addTrip, getTripsByUser } = require('../controllers/tripController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/', authMiddleware, addTrip);
router.get('/', authMiddleware, getTripsByUser);

module.exports = router;
