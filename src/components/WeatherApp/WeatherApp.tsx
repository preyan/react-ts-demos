import { FC, useEffect, useState } from "react";
import { WeatherData, GeoData } from "./WeatherAppModels";

interface WeatherDetailsProps {
  weatherData?: WeatherData;
}

const API_BASE_URL = "http://api.openweathermap.org";
const API_KEY = import.meta.env.VITE_API_KEY;

const getApiUrl = (path: string, params: Record<string, string>) => {
  const queryString = new URLSearchParams(params).toString();
  return `${API_BASE_URL}${path}?${queryString}&appid=${API_KEY}`;
};

const fetchData = async (url: string) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full border-t-4 border-blue-500 border-opacity-50 border-solid h-16 w-16"></div>
  </div>
);

const WeatherDetails: FC<WeatherDetailsProps> = ({ weatherData }) => {
  const renderWeatherIcon = (icon: string) => {
    const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
    return <img src={iconUrl} alt="Weather Icon" />;
  };

  const renderWeatherDetails = () => {
    if (!weatherData) {
      return <p>No weather data available.</p>;
    }

    const { name, main, weather, wind, clouds } = weatherData;

    return (
      <>
        <h2 className="text-xl font-bold mb-2">Current Weather in {name}</h2>
        <div className="flex items-center">
          <div className="mr-4">{renderWeatherIcon(weather[0].icon)}</div>
          <div>
            <p>Temperature: {main?.temp}°C</p>
            <p>Feels Like: {main?.feels_like}°C</p>
            <p>Description: {weather[0]?.description}</p>
          </div>
        </div>
        <div className="mt-4">
          <p>Humidity: {main?.humidity}%</p>
          <p>Wind Speed: {wind?.speed} m/s</p>
          <p>Cloudiness: {clouds?.all}%</p>
        </div>
      </>
    );
  };

  return <div className="weather-details">{renderWeatherDetails()}</div>;
};

const WeatherApp: FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [geoData, setGeoData] = useState<GeoData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [city, setCity] = useState<string>("");

  const fetchGeoData = async () => {
    try {
      setLoading(true);
      const geoDataResponse = await fetchData(
        getApiUrl("/geo/1.0/direct", { q: city })
      );
      setGeoData(geoDataResponse[0]);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (geoData) {
      const { lat, lon } = geoData;
      fetchWeatherData(lat, lon);
    }
  }, [geoData]);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const weatherDataResponse = await fetchData(
        getApiUrl("/data/2.5/weather", {
          lat: lat.toString(),
          lon: lon.toString(),
        })
      );
      setWeatherData(weatherDataResponse);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchGeoData();
  };

  return (
    <div className="container mx-auto p-10 bg-blue-100 rounded-md shadow-md max-w-sm">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-800">
        Minimal Weather
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center mb-4">
        {/* <label htmlFor="city" className="mr-2 text-blue-800">
          City
        </label> */}
        <input
          type="text"
          id="city"
          name="city"
          className="border p-2 rounded-md"
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          type="submit"
          className={`ml-2 p-2 rounded-md ${
            city.trim() === "" ? "bg-gray-500" : "bg-blue-500"
          } text-white`}
          disabled={city.trim() === ""}>
          Submit
        </button>
      </form>

      <div className="bg-gray-200 p-4 rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <WeatherDetails weatherData={weatherData} />
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
