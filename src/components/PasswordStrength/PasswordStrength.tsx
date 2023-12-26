import React, { useState } from "react";

const PasswordStrength: React.FC = () => {
  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value) {
      setPassword(value);
      const passwordScore = calculatePasswordStrength(value);
      setScore(passwordScore);
    } else {
      setPassword("");
      setScore(0);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      throw new Error("Password cannot be null or undefined");
    }

    // Regular expression conditions for password strength
    const conditions = [
      /.{8,}/, // Minimum length of 8 characters
      /[a-z]/, // Contains a lowercase letter
      /[A-Z]/, // Contains an uppercase letter
      /[0-9]/, // Contains a digit
      /[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]/, // Contains a special character
      /[\u0080-\uFFFF]/, // Contains a non-ASCII character
      /\S/, // Restrict whitespaces
      /(.)\1/, // Contains a repeated character
      /(?=.*[a-z])(?=.*[A-Z])/, // Contains both lowercase and uppercase letters
    ];

    const score = conditions.reduce(
      (score, regex) => (regex.test(password) ? score + 1 : score),
      0
    );

    return score;
  };

  const getPasswordStrengthClass = () => {
    if (score === 0) {
      return "text-sm text-red-500";
    } else if (score <= 2) {
      return "text-sm text-yellow-500";
    } else {
      return "text-sm text-green-500";
    }
  };

  const strengthBarStyle = (index: number) =>
    `w-1/4 h-2 rounded ${score >= index ? "bg-green-500" : "bg-gray-300"}`;

  return (
    <div className="my-4 p-4 border border-gray-300 rounded-md bg-white">
      <label
        htmlFor="password"
        className="block text-sm font-medium text-gray-800 mb-1">
        Password:
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
      />
      <p className={`${getPasswordStrengthClass()} mt-2 text-sm`}>
        Password Strength: {score}/4
      </p>
      <div className="flex justify-between mt-2">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className={strengthBarStyle(index)}></div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
