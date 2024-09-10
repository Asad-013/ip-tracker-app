import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import './App.css';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

// Custom marker icon
const customMarker = new L.Icon({
  iconUrl: require('./marker-icon.png'),
  iconSize: [38, 38],
});

const WEATHER_API_KEY = 'REACT_APP_WEATHER_API_KEY';
const IPINFO_API_KEY = 'REACT_APP_IPINFO_TOKEN';

const App = () => {
  const [ipData, setIpData] = useState(null);
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [ipInput, setIpInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ipHistory, setIpHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [userIP, setUserIP] = useState('');

  const fetchIpData = useCallback(async (ipAddress = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=${IPINFO_API_KEY}`);
      setIpData(response.data);
      const [lat, lon] = response.data.loc.split(",");
      setLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
      fetchWeather(parseFloat(lat), parseFloat(lon));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Invalid IP address or data not available.");
    }
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      setWeatherData(weatherResponse.data);
      
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      const dailyForecast = forecastResponse.data.list.filter((entry, index) => index % 8 === 0).slice(0, 3);
      setForecast(dailyForecast);
    } catch (error) {
      console.error("Error fetching weather data", error);
    }
  };

  useEffect(() => {
    fetchIpData(); // Fetch the user's current IP location on load
    axios.get('https://api.ipify.org?format=json').then(response => setUserIP(response.data.ip));
    const savedHistory = JSON.parse(localStorage.getItem('ipHistory')) || [];
    setIpHistory(savedHistory);

    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, [fetchIpData]);

  const handleSearch = () => {
    if (ipInput) {
      fetchIpData(ipInput);
      const updatedHistory = [...ipHistory, { ip: ipInput, time: new Date().toLocaleString() }];
      setIpHistory(updatedHistory);
      localStorage.setItem('ipHistory', JSON.stringify(updatedHistory));
    } else {
      setError("Please enter a valid IP address.");
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchWeather(latitude, longitude);
        },
        (error) => {
          setError("Unable to retrieve your location.");
        },
        { timeout: 10000 } // Timeout after 10 seconds
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1>IP & Geolocation Tracker</h1>
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>
      </div>

      <div className="input-container">
        <motion.input
          type="text"
          value={ipInput}
          onChange={(e) => setIpInput(e.target.value)}
          placeholder="Enter IP address"
          className="ip-input"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.button
          onClick={handleSearch}
          className="search-button"
          whileHover={{ scale: 1.1 }}
        >
          Search Location
        </motion.button>
        <motion.button
          onClick={handleGeolocation}
          className="geolocation-button"
          whileHover={{ scale: 1.1 }}
        >
          <FontAwesomeIcon icon={faLocationArrow} /> Get My Location
        </motion.button>
      </div>

      <div className="user-ip">
        <p><strong>Your IP Address:</strong> {userIP}</p>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : ipData ? (
        <div className="info">
          <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h2>IP: {ipData.ip}</h2>
            <p>Location: {ipData.city}, {ipData.region}, {ipData.country}</p>
          </motion.div>

          {location && (
            <MapContainer center={[location.lat, location.lon]} zoom={13} className="map">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[location.lat, location.lon]} icon={customMarker}>
                <Popup>
                  IP Location: {ipData.city}, {ipData.region}.
                </Popup>
              </Marker>
            </MapContainer>
          )}
          
          <div className="weather-info">
            {weatherData && (
              <motion.div className="weather-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <h2>Weather in {weatherData.name}</h2>
                <p>{weatherData.weather[0].description}</p>
                <p>Temperature: {weatherData.main.temp} °C</p>
              </motion.div>
            )}
            
            {forecast.length > 0 && (
              <div className="forecast">
                <h2>3-Day Forecast</h2>
                {forecast.map((day, index) => (
                  <motion.div key={index} className="forecast-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h3>{new Date(day.dt_txt).toLocaleDateString()}</h3>
                    <p>{day.weather[0].description}</p>
                    <p>Temperature: {day.main.temp} °C</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="history">
            <h3>Search History</h3>
            {ipHistory.length > 0 ? (
              <ul>
                {ipHistory.map((entry, index) => (
                  <li key={index}>{entry.ip} - {entry.time}</li>
                ))}
              </ul>
            ) : (
              <p>No history available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="no-data">No data available</div>
      )}
    </div>
  );
};

export default App;
