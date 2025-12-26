import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get('https://api.weatherstack.com/current?access_key=e6f70c1a5e1bd33da958e4ed0982015b&query=New%20Delhi');
        setWeather(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data: ", error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="container">
      <h1>Weather in New Delhi</h1>
      {loading ? (
        <p>Loading weather data...</p>
      ) : weather && weather.current ? (
        <div className="weather-info">
          <p><strong>Temperature:</strong> {weather.current.temperature}°C</p>
          <p><strong>Weather:</strong> {weather.current.weather_descriptions[0]}</p>
          <img src={weather.current.weather_icons[0]} alt="Weather icon" />
          <p><strong>Wind Speed:</strong> {weather.current.wind_speed} km/h</p>
          <p><strong>Humidity:</strong> {weather.current.humidity}%</p>
        </div>
      ) : (
        <p>Could not fetch weather data. The API may be down or there might be an issue with your API key.</p>
      )}
    </div>
  );
}

export default App;
