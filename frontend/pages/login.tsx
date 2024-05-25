/* eslint-disable prettier/prettier */
// Login.tsx
// import React, { useState } from 'react';
// import { useRouter } from 'next/router';
// import { loginUser } from '../services/api';
// import { useAuth } from '../authContext';
// import styles from '../styles/Login.module.css'; // Import CSS module for styling
//
// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { dispatch } = useAuth();
//   const router = useRouter();
//
//   const handleLogin = async () => {
//     try {
//       // Call backend API to login
//       const { token } = await loginUser({ email, password });
//       // Save token to local storage and update authentication state
//       localStorage.setItem('token', token);
//       dispatch({ type: 'LOGIN' });
//       // Redirect to home page or any other desired page
//       router.push('/');
//     } catch (error) {
//       console.error('Login failed:', error);
//       setError('Invalid email or password');
//     }
//   };
//
//   return (
//     <div className={styles.container}>
//       <h2>Login</h2>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//         className={styles.input}
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Password"
//         className={styles.input}
//       />
//       {error && <p className={styles.error}>{error}</p>}
//       <button onClick={handleLogin} className={styles.button}>Login</button>
//     </div>
//   );
// };
//
// export default Login;

// LoginPage.tsx
import React from 'react';
import LoginForm from '../components/LoginFrom';

const LoginPage = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
