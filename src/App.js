import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css'; 


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const API_KEY =  process.env.REACT_APP_OPENWEATHERMAP_API_KEY;; 

const LocationSetter = ({ location }) => {
    const map = useMap();

    if (location) {
        map.setView(location, 13); 
    }

    return null;
};

const App = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [location, setLocation] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            const { coord, main, weather } = response.data;

            setWeatherData({ temp: main.temp, description: weather[0].description });
            setLocation([coord.lat, coord.lon]);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setWeatherData(null);
            setLocation(null);
        }
    };

    return (
        <div className="map-container">
            <MapContainer center={[20, 0]} zoom={2} style={{ width: '100%', height: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                />
                {location && (
                    <Marker position={location}>
                        <Popup>{city}</Popup>
                    </Marker>
                )}
                <LocationSetter location={location} />
            </MapContainer>

            <div className="weather-card">
                <h1>Weather App</h1>
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>

                {weatherData && (
                    <div>
                        <h2>Weather in {city}</h2>
                        <p>Temperature: {weatherData.temp}°C</p>
                        <p>Description: {weatherData.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
