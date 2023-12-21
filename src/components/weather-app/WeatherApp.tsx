import { FC, useState, useEffect } from "react";
import Autosuggest, {
  ChangeEvent as AutosuggestChangeEvent,
  SuggestionsFetchRequestedParams,
} from "react-autosuggest";

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

interface InputProps {
  placeholder: string;
  value: string;
  onChange: (
    event: AutosuggestChangeEvent,
    { newValue, method }: { newValue: string; method: string }
  ) => void;
}

const WeatherApp: FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const inputProps: InputProps = {
    placeholder: "Type a city",
    value: "",
    onChange: (_, { newValue }) => {
      setValue(newValue);
    },
  };

  useEffect(() => {
    const fetchWeatherData = async (city: string) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid={API_KEY}`
        );
        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    if (value) {
      fetchWeatherData(value);
    }
  }, [value]);

  const onSuggestionsFetchRequested = async ({
    value,
  }: SuggestionsFetchRequestedParams) => {
    // Fetch suggestions from GeoDB Cities API
    const response = await fetch(
      `http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${value}&limit=5&offset=0`
    );
    const data = await response.json();
    setSuggestions(data.data.map((city: { city: string }) => city.city));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Weather App</h1>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={(suggestion: string) => suggestion}
        renderSuggestion={(suggestion: string) => <div>{suggestion}</div>}
        inputProps={inputProps}
      />
      <div className="bg-gray-200 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Current Weather</h2>
        <p>City: {weatherData?.name}</p>
        <p>Temperature: {weatherData?.main.temp}°C</p>
        <p>Description: {weatherData?.weather[0].description}</p>
      </div>
    </div>
  );
};

export default WeatherApp;
