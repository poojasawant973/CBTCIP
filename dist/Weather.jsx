import React, { useEffect, useState } from 'react';
import loader from "./Images/WeatherIcons.gif";
import haze from './Images/haze.jpg';
import clear from './Images/clear.jpeg';
import clouds from './Images/cloud.jpeg';
import rain from './Images/rain.jpeg';
import snow from './Images/snow.jpeg';
import thunderstorm from './Images/thunderstorm.jpg';
import drizzle from './Images/drizzle.jpeg';
import fog from './Images/fog.jpeg';
import ReactAnimatedWeather from "react-animated-weather";

const Weather = () => {
  const [city, setCity] = useState("Pune");
  const [finalData, setFinalData] = useState({});
  const [weatherIcon, setWeatherIcon] = useState("CLEAR_DAY");
  const [backgroundImage, setBackgroundImage] = useState("");

  const defaults = {
    color: 'white',
    size: 112,
    animate: true,
  };

  const weatherBackgrounds = {
    Clouds: clouds,
    Haze: haze,
    Clear: clear,
    Rain: rain,
    Snow: snow,
    Thunderstorm: thunderstorm,
    Drizzle: drizzle,
    Fog: fog,
  };

  const setWeatherIconAndBackground = (main) => {
    switch (main) {
      case 'Clouds':
        setWeatherIcon("CLOUDY");
        setBackgroundImage(weatherBackgrounds.Clouds);
        break;
      case 'Haze':
        setWeatherIcon("CLEAR_DAY");
        setBackgroundImage(weatherBackgrounds.Haze);
        break;
      case 'Clear':
        setWeatherIcon("CLEAR_DAY");
        setBackgroundImage(weatherBackgrounds.Clear);
        break;
      case 'Rain':
        setWeatherIcon("RAIN");
        setBackgroundImage(weatherBackgrounds.Rain);
        break;
      case 'Snow':
        setWeatherIcon("SNOW");
        setBackgroundImage(weatherBackgrounds.Snow);
        break;
      case 'Thunderstorm':
        setWeatherIcon("WIND");
        setBackgroundImage(weatherBackgrounds.Thunderstorm);
        break;
      case 'Drizzle':
        setWeatherIcon("SLEET");
        setBackgroundImage(weatherBackgrounds.Drizzle);
        break;
      case 'Fog':
        setWeatherIcon("FOG");
        setBackgroundImage(weatherBackgrounds.Fog);
        break;
      default:
        setWeatherIcon("CLEAR_DAY");
        setBackgroundImage(weatherBackgrounds.Clear);
    }
  };

  async function getWeatherData() {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=337025e23ba07f6ac5f43e4354c433d1`;
      const resp = await fetch(url);
      const result = await resp.json();

      if (!result || !result.main || !result.weather || !result.weather[0]) {
        console.error('Invalid or incomplete API response:', result);
        return;
      }

      const { temp, feels_like, pressure, humidity } = result.main;
      const { name } = result;
      const { speed } = result.wind;
      const { main, description } = result.weather[0];
      const { country } = result.sys;

      setFinalData({
        temp,
        feels_like,
        humidity,
        pressure,
        name,
        speed,
        main,
        description,
        country,
      });

      setWeatherIconAndBackground(main);
      setCity("");
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  useEffect(() => {
    getWeatherData();
  }, []);

  return (
    <div className='container'>
      <div className='weather-container' style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className='weather-content'>
          <img src={loader} alt="icon" id='w-icon' style={{ display: finalData.name ? 'none' : 'block' }}/>
          <div className='row'>
            <div className='col-md-12'>
              <input
                type="text"
                className='form-control'
                placeholder='city...'
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button onClick={getWeatherData} className='btn btn-primary' id='searchbtn'>
                Search
              </button>
            </div>
          </div>
          {finalData.name && (
            <>
              <div className='row'>
                <div className='col-md-12'>
                  <h1>
                    <ReactAnimatedWeather
                      icon={weatherIcon}
                      color={defaults.color}
                      size={defaults.size}
                      animate={defaults.animate}
                    />
                  </h1>
                  <h3>{finalData.description}</h3>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6'>
                  <h2> {finalData.temp} &deg;C</h2>
                  <p>Feels like - {finalData.feels_like} &deg;C</p>
                </div>
                <div className='col-md-6'>
                  <h4> {new Date().toLocaleTimeString()} </h4>
                  <h4>
                    {finalData.name} <small> {finalData.country} </small>
                  </h4>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-3'>
                  <h4> Speed </h4>
                  <h5> {finalData.speed} m/s </h5>
                </div>
                <div className='col-md-3'>
                  <h4> Pressure </h4>
                  <h5>{finalData.pressure} hPa</h5>
                </div>
                <div className='col-md-3'>
                  <h4> Humidity </h4>
                  <h5> {finalData.humidity} % </h5>
                </div>
                <div className='col-md-3'>
                  <h4> Atmosphere </h4>
                  <h5>{finalData.main}</h5>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Weather;
