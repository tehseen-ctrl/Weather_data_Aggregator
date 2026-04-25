import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RECENT_SEARCHES_FILE = path.join(__dirname, 'recent_searches.json');

app.use(cors());
app.use(express.json());

// Initialize recent searches file if it doesn't exist
async function initRecentSearches() {
    try {
        await fs.access(RECENT_SEARCHES_FILE);
    } catch {
        await fs.writeFile(RECENT_SEARCHES_FILE, JSON.stringify([]));
    }
}

// Helper to get recent searches
async function getRecentSearches() {
    const data = await fs.readFile(RECENT_SEARCHES_FILE, 'utf8');
    return JSON.parse(data);
}

// Helper to add a search
async function addRecentSearch(city) {
    let searches = await getRecentSearches();
    // Remove if already exists to move it to the front
    searches = searches.filter(s => s.toLowerCase() !== city.toLowerCase());
    searches.unshift(city);
    // Keep only last 5
    if (searches.length > 5) {
        searches = searches.slice(0, 5);
    }
    await fs.writeFile(RECENT_SEARCHES_FILE, JSON.stringify(searches, null, 2));
}

// Weather Route
app.get('/api/weather', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const weatherData = {
            city: response.data.name,
            temp: Math.round(response.data.main.temp),
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            condition: response.data.weather[0].main,
            description: response.data.weather[0].description
        };

        await addRecentSearch(weatherData.city);
        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'City not found' });
        } else if (error.response && error.response.status === 401) {
            res.status(401).json({ error: 'Invalid API Key. Please check your OpenWeatherMap key.' });
        } else {
            res.status(500).json({ error: 'Failed to fetch weather data from OpenWeatherMap' });
        }
    }
});

// Recent Searches Route
app.get('/api/recent', async (req, res) => {
    try {
        const searches = await getRecentSearches();
        res.json(searches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent searches' });
    }
});

app.listen(PORT, async () => {
    await initRecentSearches();
    console.log(`Server running on port ${PORT}`);
});
