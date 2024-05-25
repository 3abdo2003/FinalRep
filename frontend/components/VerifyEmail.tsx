import React, { useState } from 'react';
import { getAuthToken, verifyEmail } from '@/services/api';

export const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const token = getAuthToken();

  const verifyEmailWithToken = async () => {
    try {
      if (token) {
        const response = await verifyEmail(token);
        setMessage(response.message);
      } else {
        setMessage('Please register first.');
      }
    } catch (error) {
      setMessage('An error occurred while verifying the email.');
    }
  };

  const handleClick = () => {
    verifyEmailWithToken();
    alert(message);
  };

  return (
    <div>
      <button
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleClick}
      >
        Verify Email
      </button>
    </div>
  );
};
