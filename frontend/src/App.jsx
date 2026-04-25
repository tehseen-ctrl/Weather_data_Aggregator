import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = 'http://localhost:5000/api'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async (searchCity) => {
    if (!searchCity) return
    
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`${API_BASE_URL}/weather`, {
        params: { city: searchCity }
      })
      setWeather(response.data)
      fetchRecentSearches()
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentSearches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recent`)
      setRecentSearches(response.data)
    } catch (err) {
      console.error('Failed to fetch recent searches')
    }
  }

  useEffect(() => {
    fetchRecentSearches()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchWeather(city)
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Weather</h1>
        <p className="subtitle">Real-time weather data for any city.</p>
      </header>

      <div className="search-section">
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <p className="error-message">{error}</p>}

      {weather && (
        <div className="weather-card">
          <div className="weather-main">
            <div>
              <h2 className="city-name">{weather.city}</h2>
              <p className="weather-condition">{weather.description}</p>
            </div>
            <div className="temperature">
              {weather.temp}°
            </div>
          </div>

          <div className="weather-grid">
            <div className="grid-item">
              <p className="grid-label">Condition</p>
              <p className="grid-value">{weather.condition}</p>
            </div>
            <div className="grid-item">
              <p className="grid-label">Humidity</p>
              <p className="grid-value">{weather.humidity}%</p>
            </div>
            <div className="grid-item">
              <p className="grid-label">Wind Speed</p>
              <p className="grid-value">{weather.windSpeed} m/s</p>
            </div>
          </div>
        </div>
      )}

      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <h3 className="recent-title">Recent Searches</h3>
          <div className="recent-list">
            {recentSearches.map((item, index) => (
              <div 
                key={index} 
                className="recent-item"
                onClick={() => {
                  setCity(item)
                  fetchWeather(item)
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
