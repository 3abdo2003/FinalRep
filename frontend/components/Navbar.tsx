/* eslint-disable prettier/prettier */
// Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../authContext';

const Navbar: React.FC = () => {
  const {
    state: { isLoggedIn },
    dispatch,
  } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <nav className="navbar">
      <div>
        <Link href="/" legacyBehavior>
          <a className="nav-link">Home</a>
        </Link>
        <Link href="/products" legacyBehavior>
          <a className="nav-link">Products</a>
        </Link>
        {isLoggedIn ? (
          <>
            <Link href="/cart" legacyBehavior>
              <a className="nav-link">Cart</a>
            </Link>
            <Link href="/profile" legacyBehavior>
              <a className="nav-link">Profile</a>
            </Link>
            <Link href="/orders" legacyBehavior>
              <a className="nav-link">Orders</a>
            </Link>
            <a onClick={handleLogout} className="nav-link">
              Logout
            </a>
          </>
        ) : (
          <>
            <Link href="/login" legacyBehavior>
              <a className="nav-link">Login</a>
            </Link>
            <Link href="/signup" legacyBehavior>
              <a className="nav-link">Signup</a>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
