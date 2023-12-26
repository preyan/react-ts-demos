import CurrencyConverter from "./components/CurrencyConverter/CurrencyConverter";
import PasswordGenerator from "./components/PasswordGenerator/PasswordGenerator";
import WeatherApp from "./components/WeatherApp/WeatherApp";
import "./index.css";

function App() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <WeatherApp />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <CurrencyConverter />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <PasswordGenerator />
        </div>
      </div>
    </div>
  );
}

export default App;
