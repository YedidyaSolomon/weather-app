import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import cloude_icon from '../assets/cloude.png'
import humid_icon from '../assets/humid.png'
import rain_icon from '../assets/rain.png'
import sunny_icon from '../assets/sunny.png'
import windy_icon from '../assets/windy.gif'

const Weather = () => {
    const [weatherData, setWeatherData] = useState(false);
    const inputRef = useRef()
    
    const allIcons = {
        "01d": sunny_icon,
        "01n": sunny_icon,
        "02d": cloude_icon,
        "02n": cloude_icon,
        "03d": cloude_icon,
        "03n": cloude_icon,
        "04d": cloude_icon,
        "04n": cloude_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "11d": windy_icon,
        "11n": windy_icon,
    }

    const search = async (city) => {
        if (city===""){
            alert("enter a city name")
            return;
        }
       
        try{
           const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta
            .env.VITE_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            
            const icon = allIcons[data.weather[0].icon]
            const windSpeed = data.wind?.speed || 0;
            const windDeg = data.wind?.deg || 0;
            
            setWeatherData({
                humidity: data.main.humidity,
                tempreture: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
                windSpeed: windSpeed,
                windDeg: windDeg,
                windGust: data.wind?.gust || null
            })
        }catch(error){
           setWeatherData(false);
           console.log("Error in fetching weather data!!")
        }
    }

    useEffect(()=>{
       search("London")
    }, [])

    const getWindDirection = (deg) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return directions[Math.round(deg / 22.5) % 16];
    }

    const getWindAnimation = (speed) => {
        if (speed < 2) return 'calm';
        if (speed < 5) return 'light';
        if (speed < 11) return 'moderate';
        if (speed < 20) return 'strong';
        return 'extreme';
    }

   return (
    <div className='weather'>
      <div className='search-bar'>
        <input ref={inputRef} type ="text"  placeholder ='search'/>
        <img className='searchIcon' src={search_icon} alt="" onClick={() => search(inputRef.current.value)}/>
      </div>
      
      <img src={weatherData.icon} alt="" className='weather-icon' />
      <p className='tempreture'>{weatherData.tempreture}°C</p>
      <p className='location'>{weatherData.location}</p>
      
      <div className="weather-details">
        <div className="weather-data">
            <img src={humid_icon} alt="" />
            <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
            </div>
        </div>
        
        <div className="weather-data wind-data">
            <div className={`wind-icon-container ${getWindAnimation(weatherData.windSpeed)}`}>
                <div className="wind-arrow" style={{ transform: `rotate(${weatherData.windDeg}deg)` }}>
                    ↑
                </div>
                <div className="wind-particles">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div>
                <p>{weatherData.windSpeed} m/s</p>
                <span>{getWindDirection(weatherData.windDeg)}</span>
                {weatherData.windGust && (
                    <small>Gust: {weatherData.windGust} m/s</small>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default Weather
