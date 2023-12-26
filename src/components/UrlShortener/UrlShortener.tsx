import React, { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleShortenUrl = async (url: string) => {
    try {
      if (isValidURL(url)) {
        setError(null);
        const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: import.meta.env.VITE_BITLY_ACCESS_TOKEN,
          },
          body: JSON.stringify({
            long_url: url,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to shorten URL');
        }

        const data = await response.json();
        setShortenedUrl(data.id);
      } else {
        setError('Invalid URL. Please enter a valid URL');
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  const isValidURL = (url: string) => {
    try {
      const newUrl = new URL(url);
      return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
      return false;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast.info('URL copied to clipboard!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  return (
    <div className='my-4 p-4 border border-gray-300 rounded-md bg-white'>
      <div className=''>
        <label
          htmlFor='url'
          className='block text-sm font-medium text-gray-800 mb-1'
        >
          URL:
        </label>
        <input
          type='url'
          id='url'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder='Enter the link here'
          className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'
        />
        {error && <div className='mt-2 text-red-500'>{error}</div>}
        <button
          type='button'
          onClick={() => handleShortenUrl(url)}
          className={`rounded-lg p-2 mt-2 bg-blue-500 text-white font-bold ${
            !url
              ? 'bg-gray-500 cursor-not-allowed text-white'
              : 'bg-blue-500 cursor-pointer text-white'
          }`}
          disabled={!url}
        >
          Shorten URL{' '}
        </button>
      </div>
      {shortenedUrl && (
        <div className='mt-4'>
          <h3 className='text-lg font-semibold mb-2'>Shortened URL:</h3>
          <div className='flex items-start space-x-2'>
            <input
              type='text'
              name='shortenUrl'
              id='shortenUrl'
              value={shortenedUrl}
              readOnly
              className='border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <FiCopy
              className='text-gray-600 cursor-pointer h-5 w-5 mt-3'
              onClick={copyToClipboard}
            />
          </div>
          <ToastContainer
            position='top-right'
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='colored'
          />
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
