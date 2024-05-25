/* eslint-disable prettier/prettier */
// authContext.tsx
import React, { createContext, useReducer, useContext, useEffect } from 'react';

interface AuthState {
  isLoggedIn: boolean;
}

type AuthAction = { type: 'LOGIN' } | { type: 'LOGOUT' };

const initialState: AuthState = {
  isLoggedIn: false,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { isLoggedIn: true };
    case 'LOGOUT':
      return { isLoggedIn: false };
    default:
      return state;
  }
};

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load authentication state from local storage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      dispatch({ type: 'LOGIN' });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
