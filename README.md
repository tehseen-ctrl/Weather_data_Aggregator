# Weather Data Aggregator

A professional, minimal full-stack weather application inspired by Apple's design aesthetic.

## Features
- Real-time weather data fetching using OpenWeatherMap API.
- Search by city name.
- Displays Temperature, Humidity, Wind Speed, and Condition.
- Recent Searches persistence using a local JSON backend.
- Apple-style UI with San Francisco typography and minimal design.

## Tech Stack
- **Backend**: Node.js, Express, Axios.
- **Frontend**: React (Vite), Axios.

## Setup

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   ```
   PORT=5000
   OPENWEATHER_API_KEY=your_api_key_here
   ```
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
