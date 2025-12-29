import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './App.module.css';

function App() {
  const [query, setQuery] = useState('New Delhi');
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backgroundClass, setBackgroundClass] = useState(styles.defaultBg);

  const API_KEY = 'e6f70c1a5e1bd33da958e4ed0982015b';

  useEffect(() => {
    if (!query) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      setWeather(null);

      try {
        const response = await axios.get(
          `https://api.weatherstack.com/current?access_key=${API_KEY}&query=${query}`
        );

        if (response.data.success === false) {
          setError(response.data.error.info);
        } else {
          setWeather(response.data);
          updateBackground(response.data.current.weather_descriptions[0]);
        }
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError('Failed to fetch weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [query, API_KEY]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setQuery(input.trim());
      setInput('');
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setQuery(`${latitude},${longitude}`);
        },
        (err) => {
          setError('Geolocation failed. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const updateBackground = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('sunny') || desc.includes('clear')) {
      setBackgroundClass(styles.sunnyBg);
    } else if (desc.includes('cloudy') || desc.includes('overcast')) {
      setBackgroundClass(styles.cloudyBg);
    } else if (desc.includes('rain') || desc.includes('drizzle')) {
      setBackgroundClass(styles.rainyBg);
    } else if (desc.includes('snow') || desc.includes('blizzard')) {
      setBackgroundClass(styles.snowyBg);
    } else {
      setBackgroundClass(styles.defaultBg);
    }
  };

  return (
    <div className={`${styles.container} ${backgroundClass}`}>
      <main className={styles.main}>
        <h1 className={styles.title}>Weather Finder</h1>
        
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter city name..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>Search</button>
        </form>

        <button onClick={handleGeolocation} className={styles.geoButton}>
          Use My Location
        </button>

        {loading && <p className={styles.loading}>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
        
        {weather && weather.current && (
          <div className={styles.weatherContainer}>
            <h2 className={styles.weatherTitle}>
              {weather.location.name}, {weather.location.country}
            </h2>
            <div className={styles.weatherInfo}>
              <img
                src={weather.current.weather_icons[0]}
                alt={weather.current.weather_descriptions[0]}
                className={styles.weatherIcon}
              />
              <div className={styles.temperature}>
                {weather.current.temperature}°C
              </div>
              <div className={styles.details}>
                <p><strong>{weather.current.weather_descriptions[0]}</strong></p>
                <p>Wind: {weather.current.wind_speed} km/h {weather.current.wind_dir}</p>
                <p>Humidity: {weather.current.humidity}%</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
