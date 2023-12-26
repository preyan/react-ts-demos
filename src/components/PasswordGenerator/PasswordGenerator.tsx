import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCopy } from "react-icons/fi";

const PasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const generatePassword = () => {
    let chars = "";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) chars += "0123456789";
    if (includeSpecialChars) chars += "!@#$%^&*()-=_+[]{}|;:,.<>?";

    if (!chars) {
      alert("Please select at least one character set.");
      return;
    }

    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars.charAt(randomIndex);
    }

    setGeneratedPassword(password);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast.info("Password copied to clipboard!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <div className="password-generator bg-gray-100 p-4 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Password Generator</h2>
      <div className="mb-4">
        <label
          htmlFor="passwordLength"
          className="block text-sm font-medium text-gray-600">
          Password Length:
        </label>
        <input
          type="number"
          id="passwordLength"
          value={passwordLength}
          onChange={(e) => setPasswordLength(parseInt(e.target.value, 10))}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Include Character Sets:
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={() => setIncludeUppercase(!includeUppercase)}
              className="text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            Uppercase
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={() => setIncludeLowercase(!includeLowercase)}
              className="text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            Lowercase
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
              className="text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            Numbers
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={includeSpecialChars}
              onChange={() => setIncludeSpecialChars(!includeSpecialChars)}
              className="text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            Special Characters
          </label>
        </div>
      </div>
      <button
        onClick={generatePassword}
        className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        Generate Password
      </button>
      {generatedPassword && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Generated Password:</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={generatedPassword}
              readOnly
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiCopy
              className="text-gray-600 cursor-pointer "
              onClick={copyToClipboard}
            />
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
