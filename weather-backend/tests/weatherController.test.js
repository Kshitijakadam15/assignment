
const request = require("supertest");
const app = require("../index"); 
const axios = require("axios");
const City = require("../src/models/city"); 
const weatherController = require("../src/controllers/city"); 

jest.mock("axios");
jest.mock("../src/models/city");

describe("Weather Controller", () => {
  describe("GET /weather/:city", () => {
    it("should fetch and return weather data for a given city", async () => {
      const cityName = "London";
      const mockWeatherData = {
        main: { temp: 20 },
        weather: [{ description: "clear sky", icon: "01d" }],
      };

      axios.get.mockResolvedValue({ data: mockWeatherData });

      const req = { params: { city: cityName } };
      const res = { json: jest.fn() };

      await weatherController.getWeather(req, res);

      expect(axios.get).toHaveBeenCalledWith(
        `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );
      expect(res.json).toHaveBeenCalledWith(mockWeatherData);
    });

    it("should return a 404 error if city is not found", async () => {
      axios.get.mockRejectedValue(new Error("City not found"));
      
      const req = { params: { city: "UnknownCity" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
      await weatherController.getWeather(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "City not found" });
    });
  });

  describe("POST /weather/city", () => {
    it("should add a new city with weather data", async () => {
      const cityName = "Paris";
      const mockWeatherData = {
        main: { temp: 25, humidity: 40 },
        weather: [{ description: "sunny", icon: "01d" }],
        wind: { speed: 5 },
        sys: { sunrise: 1618317040, sunset: 1618360840 },
      };

      axios.get.mockResolvedValue({ data: mockWeatherData });

      City.prototype.save = jest.fn().mockResolvedValue({
        name: cityName,
        weather: {
          temperature: 25,
          condition: "sunny",
          icon: "01d",
          humidity: 40,
          windSpeed: 5,
          sunrise: new Date(mockWeatherData.sys.sunrise * 1000).toLocaleTimeString(),
          sunset: new Date(mockWeatherData.sys.sunset * 1000).toLocaleTimeString(),
        },
      });

      const req = { body: { name: cityName } };
      const res = { json: jest.fn() };

      await weatherController.addCity(req, res);

      expect(axios.get).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: cityName,
        weather: expect.objectContaining({
          temperature: 25,
          condition: "sunny",
        }),
      }));
    });

    it("should return a 400 error if there is an error adding the city", async () => {
      axios.get.mockRejectedValue(new Error("Error adding city"));

      const req = { body: { name: "InvalidCity" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await weatherController.addCity(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Error adding city" });
    });
  });

  describe("GET /weather/cities", () => {
    it("should retrieve the list of tracked cities with their weather data", async () => {
      const mockCities = [
        {
          name: "City1",
          weather: {
            temperature: 18,
            condition: "cloudy",
          },
        },
        {
          name: "City2",
          weather: {
            temperature: 22,
            condition: "sunny",
          },
        },
      ];

      City.find.mockResolvedValue(mockCities);

      const req = {};
      const res = { json: jest.fn() };

      await weatherController.getCities(req, res);

      expect(City.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockCities);
    });

    it("should return a 500 error if there is an error fetching cities", async () => {
      City.find.mockRejectedValue(new Error("Error fetching cities"));

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await weatherController.getCities(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error fetching cities" });
    });
  });

  describe("DELETE /weather/city/:id", () => {
    it("should remove a city from tracking", async () => {
      City.findByIdAndDelete.mockResolvedValue(true);

      const req = { params: { id: "cityId" } };
      const res = { json: jest.fn() };

      await weatherController.deleteCity(req, res);

      expect(City.findByIdAndDelete).toHaveBeenCalledWith("cityId");
      expect(res.json).toHaveBeenCalledWith({ message: "City removed" });
    });

    it("should return a 404 error if city is not found", async () => {
      City.findByIdAndDelete.mockResolvedValue(null);

      const req = { params: { id: "invalidId" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await weatherController.deleteCity(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "City not found" });
    });
  });
});
