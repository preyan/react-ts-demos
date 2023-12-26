import React, { FC, useEffect, useState } from "react";

const API_BASE_URL = "https://open.er-api.com/v6/latest/";
const API_KEY = import.meta.env.VITE_OPEN_EXCHANGE_API_KEY;

interface CurrencyConverterProps {}

const CurrencyConverter: FC<CurrencyConverterProps> = () => {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExchangeRate = async (from: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}latest?base=${from}&access_key=${API_KEY}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      throw new Error("An error occurred while fetching data.");
    }
  };

  useEffect(() => {
    const fetchLatestRates = async () => {
      try {
        setLoading(true);
        const data = await fetchExchangeRate(fromCurrency);
        setCurrencies(Object.keys(data.rates));
        setExchangeRate(data.rates[toCurrency]);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestRates();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedAmount(amount * exchangeRate);
    }
  }, [amount, exchangeRate]);

  return (
    <div className="container mx-auto p-10 bg-slate-400 rounded-md shadow-md max-w-sm">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Currency Converter
      </h2>
      <CurrencySelection
        label="From Currency:"
        id="fromCurrency"
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        currencies={currencies}
      />
      <CurrencySelection
        label="To Currency:"
        id="toCurrency"
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        currencies={currencies}
      />
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
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <p className="text-lg font-semibold">
            {amount} {fromCurrency} is equal to {convertedAmount} {toCurrency}
          </p>
        )}
      </div>
    </div>
  );
};

interface CurrencySelectionProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  currencies: string[];
}

const CurrencySelection: FC<CurrencySelectionProps> = ({
  label,
  id,
  value,
  onChange,
  currencies,
}) => (
  <div className="col-span-1">
    <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  </div>
);

export default CurrencyConverter;
