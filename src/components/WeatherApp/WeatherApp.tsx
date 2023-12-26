import { FC, useEffect, useState } from "react";
import { WeatherData, GeoData, Country } from "./WeatherAppModels";

interface WeatherDetailsProps {
  weatherData?: WeatherData;
  isUserInputEmpty?: boolean;
}

const API_BASE_URL = "https://api.openweathermap.org";
//api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}
const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

const getApiUrl = (path: string, params: Record<string, string>) => {
  let queryString = new URLSearchParams(params).toString();
  queryString = queryString.includes("%2C")
    ? queryString.replace("%2C", ",")
    : queryString;

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

const WeatherDetails: FC<WeatherDetailsProps> = ({
  weatherData,
  isUserInputEmpty,
}) => {
  const renderWeatherIcon = (icon: string) => {
    const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
    return <img src={iconUrl} alt="Weather Icon" />;
  };

  const renderWeatherDetails = () => {
    if (!weatherData && !isUserInputEmpty) {
      return <p>No weather data available.</p>;
    } else if (!weatherData && isUserInputEmpty) {
      return <p>Please enter a city name / zip code</p>;
    }
    const { name, main, weather, wind, clouds } = weatherData!;

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
  const [zipcode, setZipcode] = useState<number>();

  const [selectedLocation, setSelectedLocation] = useState<string>("city");

  const [countries, setCountries] = useState<Country[]>([]);

  const [selectedCountryCode, setSelectedCountryCode] = useState("");

  const fetchGeoData = async (isCitySelected: boolean) => {
    try {
      setLoading(true);
      const path = isCitySelected ? "/geo/1.0/direct" : "/geo/1.0/zip";
      const params = isCitySelected
        ? { q: city }
        : { zip: `${zipcode?.toString()},${selectedCountryCode}` };
      const geoDataResponse = await fetchData(
        getApiUrl(path, params as unknown as Record<string, string>)
      );

      if (!geoDataResponse.length) setLoading(false);
      setGeoData(
        Array.isArray(geoDataResponse) ? geoDataResponse[0] : geoDataResponse
      );
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchCountryCodeList = async () => {
    try {
      fetch("https://countriesnow.space/api/v0.1/countries/capital")
        .then((response) => response.json())
        .then((data) => {
          setCountries(data.data);
        })
        .catch((error) => console.error("Error fetching countries:", error));
    } catch (error) {
      console.error("Err:", error);
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

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountryCode(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    fetchGeoData(selectedLocation === "city");
    e.preventDefault();
  };

  useEffect(() => {
    fetchCountryCodeList();
  }, []);

  const verifyInput = () => {
    return (
      (selectedLocation === "city" && !city.trim()) ||
      (selectedLocation === "zipcode" && (!zipcode || !selectedCountryCode))
    );
  };

  return (
    <div className="container mx-auto p-10 bg-gradient-to-b from-blue-300 to-blue-100 rounded-md shadow-md max-w-sm">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-800">
        Minimal Weather
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col mb-4">
        <div className="flex flex-row space-x-4 mb-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="city"
              name="location"
              value="city"
              checked={selectedLocation === "city"}
              onChange={() => setSelectedLocation("city")}
              className="mr-2"
            />
            <label htmlFor="city">City</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="zipcode"
              name="location"
              value="zipcode"
              checked={selectedLocation === "zipcode"}
              onChange={() => setSelectedLocation("zipcode")}
              className="mr-2"
            />
            <label htmlFor="zipcode">Zipcode</label>
          </div>
        </div>

        <div className="flex flex-row items-center">
          {selectedLocation === "city" ? (
            <input
              type="text"
              id="user_input"
              name="user_input"
              className="border p-2 rounded-md mr-2 w-full"
              placeholder="Enter City Name"
              onChange={(e) => setCity(e.target.value)}
              required
            />
          ) : (
            <>
              <input
                type="number"
                id="user_input"
                name="user_input"
                className="border p-2 rounded-md mr-2 w-2/3"
                placeholder="Enter Zipcode"
                onChange={(e) => setZipcode(Number(e.target.value))}
              />
              <select
                value={selectedCountryCode}
                onChange={handleCountryChange}
                className="border p-2 rounded-md w-1/3 mb-2 md:mb-0 md:mr-2"
                required>
                <option value="">Select a country</option>
                {countries?.map((country, index) => (
                  <option key={index} value={country.iso2}>
                    {country.name} ({country.iso2})
                  </option>
                ))}
              </select>
            </>
          )}

          <button
            type="submit"
            className={`p-2 rounded-md ${
              verifyInput()
                ? "bg-gray-500 cursor-not-allowed text-white"
                : "bg-blue-500 cursor-pointer text-white"
            }`}
            disabled={verifyInput()}>
            Submit
          </button>
        </div>
      </form>

      <div className="bg-gray-400 p-4 rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <WeatherDetails weatherData={weatherData} isUserInputEmpty={!city} />
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
