
const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/city');

router.get('/weather/:city', weatherController.getWeather);
router.post('/cities', weatherController.addCity);
router.get('/cities', weatherController.getCities);
router.delete('/cities/:id', weatherController.deleteCity);

module.exports = router;
