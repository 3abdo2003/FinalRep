/* eslint-disable prettier/prettier */
// pages/_app.tsx
import '../globals.css';
import { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../authContext';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default MyApp;
