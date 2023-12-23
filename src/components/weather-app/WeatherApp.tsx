import { FC, useEffect, useState } from 'react';

interface GeoData {
  name: string;
  local_names?: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export interface WeatherData {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  rain: Rain;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Clouds {
  all: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

export interface Rain {
  '1h': number;
}

export interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

const WeatherApp: FC = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [geoData, setGeoData] = useState<GeoData>();

  const [loading, setLoading] = useState<boolean>(false);
  const [city, setCity] = useState<string>('');

  const fetchGeoData = async () => {
    try {
      setLoading(true);
      const geoDataResponse = await (
        await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`
        )
      ).json();
      setGeoData(geoDataResponse[0]);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching geo data:', error);
    }
  };
  useEffect(() => {
    if (geoData) fetchWeatherData();
  }, [geoData]);
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${geoData?.lat}&lon=${geoData?.lon}&appid=${API_KEY}`
      );
      const weatherDataResponse = await response.json();
      setWeatherData(weatherDataResponse);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Weather App</h1>
      <div className='bg-gray-200 p-4 rounded-lg'>
        {loading ? (
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full border-t-4 border-blue-500 border-opacity-50 border-solid h-16 w-16'></div>
          </div>
        ) : (
          <>
            <h2 className='text-xl font-bold mb-2'>Current Weather</h2>
            <p>City: {weatherData?.name}</p>
            <p>Temperature: {weatherData?.main?.temp}°C</p>
            <p>Description: {weatherData?.weather[0].description}</p>
          </>
        )}
      </div>

      <div>
        <label>City</label>
        <input
          type='text'
          name='city'
          className='bg-red-300'
          onChange={(e) => setCity(e.target.value)}
        />
        <button type='submit' onClick={() => fetchGeoData()}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default WeatherApp;
