import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import rainy_icon from '../assets/rainy.png'
import thunderstrom_icon from '../assets/thunderstorm.png'
import night_icon from '../assets/nightcloud.png'
import moon_icon from '../assets/moon.png'
import humidity_icon from '../assets/humidity.png'
import night_img from '../assets/night.png'
import sunny_img from '../assets/sunny.jpg'
import clearsky_img from '../assets/clearsky.jpg'
import rainy_img from '../assets/rainy.jpg'
import thunder_img from '../assets/thunder.jpg'
import sunrise_icon from '../assets/sunrise.png'
import sunset_icon from '../assets/sunset.png'
import air_icon from '../assets/air.png'
import eye_icon from '../assets/eye.png'

const Weather = ({ setBackgroundImg }) => {

    const inputRef = useRef()

    const [weatherData, setWeatherData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [localTime, setLocalTime] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const allIcons = {
        "01d": clear_icon,
        "01n": moon_icon,
        "02d": cloud_icon,
        "02n": night_icon,
        "03d": cloud_icon,
        "03n": night_icon,
        "04d": cloud_icon,
        "04n": night_icon,
        "09d": rain_icon,
        "09n": rainy_icon,
        "10d": rain_icon,
        "10n": rainy_icon,
        "11d": thunderstrom_icon,
        "11n": thunderstrom_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    }

    const backImages = {
        "01d": sunny_img,
        "01n": night_img,
        "02d": clearsky_img,
        "02n": night_img,
        "03d": clearsky_img,
        "03n": night_img,
        "04d": clearsky_img,
        "04n": night_img,
        "09d": rainy_img,
        "09n": night_img,
        "10d": rainy_img,
        "10n": night_img,
        "11d": thunder_img,
        "11n": thunder_img,
        "13d": clearsky_img,
        "13n": night_img,
    };

    const fetchCitySuggestions = async (input) => {
        if (input.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        try {
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${import.meta.env.VITE_APP_ID}`
            );
            const data = await response.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            setErrorMessage('Failed to fetch city suggestions.');
        }
    };

    const search = async (city) => {
        if (city === "") {
            alert("Enter City Name");
            return;
        }
        setIsLoading(true);
        setShowSuggestions(false);
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
            const response = await fetch(url);
            const data = await response.json();

            setSearchHistory([...new Set([city, ...searchHistory])].slice(0, 5));  // Update search history
            if (!response.ok) {
                setErrorMessage("City not found or API error occurred.");
                setIsLoading(false);
                return;
            }
            setErrorMessage('');
            console.log(data);
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            const backgroundimg = backImages[data.weather[0].icon] || sunny_img;

            setTimeout(() => {
                setWeatherData({
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    temperature: Math.floor(data.main.temp),
                    location: data.name,
                    country: data.sys.country,
                    icon: icon,
                    backgroundimg: backgroundimg,
                    sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }),
                    sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }),
                    timezone: data.timezone,
                    visibility: (data.visibility / 1609.34).toFixed(2),
                    pressure: data.main.pressure,
                });
                setIsLoading(false); // Stop loading after data is set
                setBackgroundImg(backgroundimg);
            }, 1000);

        } catch (error) {
            setIsLoading(false);
            setWeatherData(false);
            setErrorMessage("An error occurred while fetching data.");
        }
    }
    const handleInputChange = (e) => {
        const userInput = e.target.value;
        fetchCitySuggestions(userInput);
    };

    useEffect(() => {
        const updateLocalTime = () => {
            if (weatherData) {
                const localDate = new Date();
                setLocalTime(localDate.toLocaleTimeString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                    // timeZone: 'Asia/Kolkata',
                }));
            }
        };

        if (weatherData) {
            updateLocalTime(); // Initial update
            const intervalId = setInterval(updateLocalTime, 1000); // Update every second

            return () => clearInterval(intervalId); // Clean up interval on unmount
        }
    }, [weatherData]);

    useEffect(() => {
        search("Jharkhand");
    }, [])

    return (
        <div className='weather'>
            <p className='local-time'>{localTime}</p>
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder='Search' onChange={handleInputChange} onFocus={() => setShowSuggestions(true)} />
                <img src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
                {showSuggestions && suggestions.length > 0 && (
                    <div className="suggestions">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="suggestion-item"
                                onClick={() => {
                                    search(suggestion.name);
                                    setShowSuggestions(false);
                                }}
                            >
                                {suggestion.name}, {suggestion.country}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="search-history">
                {searchHistory.map((city, index) => (
                    <button key={index} onClick={() => search(city)}>{city}</button>
                ))}
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {isLoading ? (<div className="spinner"></div>) : (
                weatherData && (
                    <>
                        <div className="weather-icon-temp">
                            <img src={weatherData.icon} alt="" className='weather-icon' />
                            <div className="temp-location">
                                <p className='temperature'>{weatherData.temperature}°c</p>
                                <p className='location'>{weatherData.location},{weatherData.country}</p>
                            </div>
                        </div>
                        <div className="weather-update">
                            <div className="weather-data">
                                <div className="col">
                                    <img src={sunrise_icon} alt="" />
                                    <div>
                                        <p>{weatherData.sunrise}</p>
                                        <span>Sunrise</span>
                                    </div>
                                </div>

                                <div className="col">
                                    <img src={humidity_icon} alt="" />
                                    <div>
                                        <p>{weatherData.humidity}%</p>
                                        <span>Humidity</span>
                                    </div>
                                </div>
                                <div className="col">
                                    <img src={eye_icon} alt="" />
                                    <div>
                                        <p>{weatherData.visibility} miles</p>
                                        <span>visibility</span>
                                    </div>
                                </div>
                            </div>
                            <div className="weather-data">
                                <div className="col">
                                    <img src={sunset_icon} alt="" />
                                    <div>
                                        <p>{weatherData.sunset}</p>
                                        <span>Sunset</span>
                                    </div>
                                </div>
                                <div className="col">
                                    <img src={wind_icon} alt="" />
                                    <div>
                                        <p>{weatherData.windSpeed} km/h</p>
                                        <span>Wind Speed</span>
                                    </div>
                                </div>

                                <div className="col">
                                    <img src={air_icon} alt="" />
                                    <div>
                                        <p>{weatherData.pressure} hpa</p>
                                        <span>pressure</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            )}
        </div>
    )
}

export default Weather
