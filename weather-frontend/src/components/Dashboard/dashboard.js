import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./units/nav";
import Sidebar from "./units/sidebar";
import Loading from "../../assets/XOsX.gif"

const Dashboard = ({ logout }) => {
  const [cities, setCities] = useState([]); 
  const [newCity, setNewCity] = useState(""); 
  const [selectedCity, setSelectedCity] = useState(null); 
  const [loading, setLoading] = useState(false); 

  const apiBaseUrl = "http://localhost:1530/api"; 
  const fetchWeatherData = async (city) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/weather/${city}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/cities`);
      setCities(response.data); 
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const addCity = async () => {
    if (!newCity.trim()) return;

    const data = await fetchWeatherData(newCity);
    if (data) {
      try {
        await axios.post(`${apiBaseUrl}/cities`, { name: newCity }); 
        setCities([...cities, data]);
        setNewCity("");
      } catch (error) {
        console.error("Error adding city:", error);
      }
    }
  };

  const removeCity = async (cityId) => {
    try {
      await axios.delete(`${apiBaseUrl}/cities/${cityId}`); 
      setCities(cities.filter((city) => city._id !== cityId)); 
    } catch (error) {
      console.error("Error removing city:", error);
    }
  };


  const showCityDetails = (city) => {
    setSelectedCity(city);
  };

  const clearCityDetails = () => {
    setSelectedCity(null);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <>
      <Nav onlogout={logout} />
      <div className="flex">
        <Sidebar onlogout={logout} />
        <div className="ml-64 flex-1">
          <div className="p-4">
            <h2 className="text-2xl mb-4">Dashboard</h2>
            <div className="mb-6">
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Enter city name"
                className="px-4 py-2 border rounded-md"
              />
              <button
                onClick={addCity}
                className="bg-violet-400 text-white px-4 py-2 rounded-md ml-2 hover:bg-violet-500"
              >
                Add City
              </button>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cities.map((city) => (
                <div
                  key={city._id}
                   className="bg-[linear-gradient(to_top_left,_#cbc3e9,_#ffc0cb,_#ffc0cb)] p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                 
                >
                  <h3 className="text-xl font-semibold">{city.name}</h3>
                  <div className="text-sm">
                    {city.weather?.[0]?.description || "No description available"}
                  </div>
                  <div className="flex items-center mt-2">
                    <img
                      src={`https://openweathermap.org/img/wn/${
                        city.weather?.[0]?.icon || "01d"
                      }.png`} 
                      alt={city.weather?.[0]?.description || "Weather icon"}
                      className="w-10 h-10"
                    />
                    <div className="ml-2 text-lg">
                      {Math.round(city.main?.temp || 0)}°C
                    </div>
                  </div>
                  <button
                    onClick={() => showCityDetails(city)}
                     className="bg-violet-600 text-white px-2 py-2 rounded-md hover:bg-violet-800 mb-2 mt-2"
                  
                  >
                    Details
                  </button>
                  <button
                    onClick={() => removeCity(city._id)}
                      className="bg-red-600 text-white px-2 py-2 rounded-md hover:bg-red-700 ml-3" 
                  >
                    Remove 
                  </button>
                 
                </div>
              ))}
            </div>

            {selectedCity && (
              <div   
              className="mt-6 p-4 bg-[linear-gradient(to_top_left,_#ffc0cb,_#ffc0cb,_#cbc3e9)] rounded-lg shadow-sm sm:w-64"
              >
                <h3 className="text-2xl font-semibold">
                  {selectedCity.name} Details
                </h3>
                <div className="mt-2">
                  <p>Humidity: {selectedCity.main?.humidity || "N/A"}%</p>
                  <p>Wind Speed: {selectedCity.wind?.speed || "N/A"} m/s</p>
                  <p>
                    Sunrise:{" "}
                    {new Date(selectedCity.sys?.sunrise * 1000).toLocaleTimeString() ||
                      "N/A"}
                  </p>
                  <p>
                    Sunset:{" "}
                    {new Date(selectedCity.sys?.sunset * 1000).toLocaleTimeString() ||
                      "N/A"}
                  </p>
                </div>
                <button
                  onClick={clearCityDetails}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Close Details
                </button>
              </div>
              
            )}

            {loading && (
              <div className="mt-4 text-center">
          
          <img 
        src={Loading} 
        alt="Loading..." 
        style={{ width: '300px', height: '300px', marginRight: '10px' }} 
      />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
