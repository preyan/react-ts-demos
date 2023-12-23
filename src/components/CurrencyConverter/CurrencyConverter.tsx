import { FC, useEffect, useState } from "react";

const API_BASE_URL = "https://open.er-api.com/v6/latest/";
const API_KEY = import.meta.env.VITE_OPEN_EXCHANGE_API_KEY;

const CurrencyConverter: FC = () => {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the latest currency rates on component mount
    const fetchLatestRates = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}latest?base=${fromCurrency}&access_key=${API_KEY}`
        );
        const data = await response.json();

        setCurrencies(Object.keys(data.rates));
        setExchangeRate(data.rates[toCurrency]);
      } catch (error) {
        console.error("Error fetching latest rates:", error);
      }
    };

    fetchLatestRates();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    // Update the converted amount whenever the amount or exchange rate changes
    if (exchangeRate !== null) {
      setConvertedAmount(amount * exchangeRate);
    }
  }, [amount, exchangeRate]);

  return (
    <div className="container mx-auto p-10 bg-slate-400 rounded-md shadow-md max-w-sm">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Currency Converter
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label
            htmlFor="fromCurrency"
            className="block text-gray-700 font-medium mb-2">
            From Currency:
          </label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1">
          <label
            htmlFor="toCurrency"
            className="block text-gray-700 font-medium mb-2">
            To Currency:
          </label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label
            htmlFor="amount"
            className="block text-gray-700 font-medium mb-2">
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-2 mt-4">
          <p className="text-lg font-semibold">
            {amount} {fromCurrency} is equal to {convertedAmount} {toCurrency}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
