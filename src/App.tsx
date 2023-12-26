import CurrencyConverter from './components/CurrencyConverter/CurrencyConverter';
import FormValidation from './components/FormValidation/FormValidation';
import PasswordGenerator from './components/PasswordGenerator/PasswordGenerator';
import PasswordStrength from './components/PasswordStrength/PasswordStrength';
import UrlShortener from './components/UrlShortener/UrlShortener';
import WeatherApp from './components/WeatherApp/WeatherApp';
import './index.css';

function App() {
  return (
    <div className='container mx-auto p-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4'>
        <div className='bg-white rounded-lg shadow-md p-4'>
          <WeatherApp />
        </div>
        <div className='bg-white rounded-lg shadow-md p-4'>
          <CurrencyConverter />
        </div>
        <div className='bg-white rounded-lg shadow-md p-4'>
          <PasswordGenerator />
        </div>
        <div className='bg-white rounded-lg shadow-md p-4'>
          <PasswordStrength />
        </div>
        <div className='bg-white rounded-lg shadow-md p-4'>
          <UrlShortener />
        </div>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4'></div>
      <div className='bg-white rounded-lg shadow-md p-4'>
        <FormValidation />
      </div>
    </div>
  );
}

export default App;
