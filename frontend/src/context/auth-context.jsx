// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_USER } from '../../graphql/mutations';

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null)
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for token on initial load
    const token = localStorage.getItem('user-token');
    if (token && !loading) {
      // Set user if token exists
      setLoading(true)
      client.query({ query: GET_USER })
        .then(({ data}) => {
          if (data && data.me) {
            setUser(data.me)
          }
        })
      .catch(error => {
        console.error("Error fetching user data:", error)
        logout()
      })
      .finally(() => setLoading(false))
    }
  }, [client, loading]);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token)
    localStorage.setItem('user-token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null)
    localStorage.removeItem('user-token');
    client.resetStore();
  };

  const contextValue = { 
   user,
   login,
   logout,
   token
   }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
