// /* eslint-disable prettier/prettier */
// // Signup.tsx
// import React, { useState } from 'react';
// import { useRouter } from 'next/router';
// import { signupUser } from '../services/api';
// import { useAuth } from '../authContext';
// import styles from '../styles/SignupForm.module.css'; // Import CSS module for styling
//
// const Signup: React.FC = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//     company: '',
//     address: '',
//     password: '',
//   });
//   const [error, setError] = useState<string | null>(null);
//   const { dispatch } = useAuth();
//   const router = useRouter();
//
//   const handleSignup = async () => {
//     try {
//       // Clear previous error
//       setError(null);
//       // Call backend API to signup
//       const { token } = await signupUser(formData);
//       // Save token to local storage and update authentication state
//       localStorage.setItem('token', token);
//       dispatch({ type: 'LOGIN' });
//       // Redirect to home page or any other desired page
//       router.push('/');
//     } catch (error: any) {
//       console.error('Signup failed:', error);
//       setError(error.response?.data?.message || 'Signup failed');
//     }
//   };
//
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
//   };
//
//   return (
//     <div className={styles.container}>
//       <h2>Signup</h2>
//       {error && <p className={styles.error}>{error}</p>}
//       <input
//         type="text"
//         name="firstName"
//         value={formData.firstName}
//         onChange={handleChange}
//         placeholder="First Name"
//         className={styles.input}
//       />
//       <input
//         type="text"
//         name="lastName"
//         value={formData.lastName}
//         onChange={handleChange}
//         placeholder="Last Name"
//         className={styles.input}
//       />
//       <input
//         type="email"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         placeholder="Email"
//         className={styles.input}
//       />
//       <input
//         type="text"
//         name="phoneNumber"
//         value={formData.phoneNumber}
//         onChange={handleChange}
//         placeholder="Phone Number"
//         className={styles.input}
//       />
//       <input
//         type="text"
//         name="company"
//         value={formData.company}
//         onChange={handleChange}
//         placeholder="Company"
//         className={styles.input}
//       />
//       <input
//         type="text"
//         name="address"
//         value={formData.address}
//         onChange={handleChange}
//         placeholder="Address"
//         className={styles.input}
//       />
//       <input
//         type="password"
//         name="password"
//         value={formData.password}
//         onChange={handleChange}
//         placeholder="Password"
//         className={styles.input}
//       />
//       <button onClick={handleSignup} className={styles.button}>Signup</button>
//     </div>
//   );
// };
//
// export default Signup;

'use client';

import SignupForm from '@/components/SignupFrom';

export default function SignupPage() {
  return (
    <div>
      <h1>Sign Up</h1>
      <SignupForm />
    </div>
  );
}
