// ResetPassword.tsx
'use client';
import React, { useState } from 'react';
import { getAuthToken, resetPassword } from '@/services/api';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const token = getAuthToken();
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      await resetPassword({
        token,
        password,
      });
      alert('Password reset successfully');
      router.push('/');
    } catch (error) {
      alert('Password not reset');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
