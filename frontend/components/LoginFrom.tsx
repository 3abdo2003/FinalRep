'use client';
import React, { useState } from 'react';
import { getAuthToken, login, setAuthToken } from '@/services/api';
import { useRouter } from 'next/navigation';
import ForgotPassword from '@/components/ForgotPassword';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  // const token = getAuthToken();
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = { email, password };
    const response = await login(data);
    if (
      response.message === 'User not found' ||
      response.message === 'Invalid password'
    ) {
      alert('invalid credentials');
    } else {
      router.push('/');
      alert('login successful');
    }
  };

  // const handleSubmit = async (event: any) => {
  //   event.preventDefault();
  //   const data = { email, password };
  //   const response = await login(data);
  //   setAuthToken(token);
  //   if (
  //     response.message === 'User not found' ||
  //     response.message === 'Invalid password'
  //   ) {
  //     alert('invalid credentials');
  //   } else {
  //     router.push('/');
  //     alert('login successful');
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="max-w-md w-full space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
          <a
            href="http://localhost:4000/signup"
            className="text-xl  text-indigo-600 hover:text-indigo-900"
          >
            Go register page if you do not have an account
          </a>
        </form>
        <ForgotPassword />
      </div>
    </div>
  );
};

export default LoginForm;
