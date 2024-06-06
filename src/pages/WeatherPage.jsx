import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { getBackgroundImage } from '../utils/weatherBackgrounds';
import '../styles/WeatherPage.css';

const WEATHER_API_KEY = '597019841e8a32229b4eaaccde27015a';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const WeatherPage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const lat = params.get('lat');
    const lon = params.get('lon');
    const unit = params.get('unit');

    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const weatherResponse = await axios.get(WEATHER_API_URL, {
                    params: {
                        lat,
                        lon,
                        units: unit,
                        appid: WEATHER_API_KEY,
                    },
                });
                setWeatherData(weatherResponse.data);

                const forecastResponse = await axios.get(FORECAST_API_URL, {
                    params: {
                        lat,
                        lon,
                        units: unit,
                        appid: WEATHER_API_KEY,
                    },
                });
                setForecastData(forecastResponse.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch weather data.');
            }
        };

        fetchWeatherData();
    }, [lat, lon, unit]);

    const getDailyForecast = (forecastData) => {
        const dailyForecasts = [];
        const dateMap = {};

        forecastData.list.forEach((item) => {
            const date = new Date(item.dt_txt).toDateString();
            if (!dateMap[date]) {
                dateMap[date] = [];
            }
            dateMap[date].push(item);
        });

        Object.keys(dateMap).forEach((date) => {
            const dayData = dateMap[date];
            const temps = dayData.map(item => item.main.temp);
            const tempMin = Math.min(...temps);
            const tempMax = Math.max(...temps);
            const main = dayData[0].weather[0].main;
            const pop = Math.max(...dayData.map(item => item.pop)); // Maximum probability of precipitation
            dailyForecasts.push({
                date,
                tempMin,
                tempMax,
                main,
                pop,
            });
        });

        return dailyForecasts;
    };

    const backgroundImage = weatherData ? getBackgroundImage(weatherData.weather[0].main) : null;
    return (
        <Container className="WeatherPage" style={{ backgroundImage: `url(${backgroundImage})` }}>
            {error && <Alert variant="danger">{error}</Alert>}
            {weatherData && forecastData && (
                <>
                    <Row className="mb-4">
                        <Col>
                            <div className='header_text'>
                                <h1>{weatherData.name}</h1>
                                <p>{new Date().toLocaleDateString()}</p>
                            </div>
                            <div className='tempData'>
                                <h1>{weatherData.main.temp}° {unit === 'metric' ? 'C' : 'F'}</h1>
                            </div>
                            <div className='tempNote'>
                                <label>{weatherData.weather[0].description}</label>
                                <p><i class="bi bi-droplet"></i> {weatherData.main.humidity}%</p>
                                <p><i class="bi bi-wind"></i> {weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row>
                                {getDailyForecast(forecastData).map((forecast, index) => (
                                    <Col key={index} className="forecast-day">
                                        <h4 className='date'>{forecast.date}</h4>
                                        <p>{forecast.main}</p>
                                        <p>Min: {forecast.tempMin}°</p>
                                        <p>Max: {forecast.tempMax}°</p>
                                        <p><i class="bi bi-cloud-lightning-rain"></i> {(forecast.pop * 100).toFixed(0)}%</p>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default WeatherPage;