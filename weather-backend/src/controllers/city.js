const axios = require("axios");
const City = require("../models/city");
require("dotenv").config();

const fetchWeatherData = async (cityName) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};

// Fetch weather data for a specific city
exports.getWeather = async (req, res) => {
  const cityName = req.params.city;
  try {
    const weatherData = await fetchWeatherData(cityName);
    res.json(weatherData);
  } catch (error) {
    res.status(404).json({ error: "City not found" });
  }
};

// Add a new city to track and store its weather data
exports.addCity = async (req, res) => {
  const cityName = req.body.name;
  try {
    const weatherData = await fetchWeatherData(cityName);

    const city = new City({
      name: cityName,
      weather: {
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(),
      },
    });

    await city.save();
    res.json(city);
  } catch (error) {
    res.status(400).json({ error: "Error adding city" });
  }
};

// Retrieve the list of tracked cities with their weather data
exports.getCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cities" });
  }
};

// Remove a city from tracking
exports.deleteCity = async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.json({ message: "City removed" });
  } catch (error) {
    res.status(404).json({ error: "City not found" });
  }
};

// Update weather data for all tracked cities
exports.updateWeatherData = async () => {
  const cities = await City.find();
  cities.forEach(async (city) => {
    const weatherData = await fetchWeatherData(city.name);
    city.weather = {
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(),
    };
    city.lastUpdated = Date.now();
    await city.save();
  });
};
