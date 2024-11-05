

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./src/routes/user.js");
const weatherRoutes = require("./src/routes/city.js");
const { updateWeatherDataForTrackedCities } = require("./src/controllers/city.js");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./src/db/db.js");

// Routes
app.use("/", userRoutes);
app.use("/api", weatherRoutes);  

// Server setup
const server = http.createServer(app);

// Update weather data every hour
const oneHour = 60 * 60 * 1000; 
setInterval(async () => {
  try {
    await updateWeatherDataForTrackedCities();
    console.log("Weather data updated for tracked cities.");
  } catch (error) {
    console.error("Error updating weather data:", error);
  }
}, oneHour);

// Start server
const PORT = process.env.PORT || 1530;
server.listen(PORT, () => {
  console.log(`Listening on Port ${PORT} !!`);
});
