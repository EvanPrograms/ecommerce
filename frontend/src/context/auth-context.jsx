// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_USER } from '../../graphql/mutations';

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    // Check for token on initial load
    const token = localStorage.getItem('user-token');
    if (token) {
      // Set user if token exists
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
    }
  }, [client]);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user-token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user-token');
    client.resetStore();
  };

  const contextValue = { 
   user,
   login,
   logout
   }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
