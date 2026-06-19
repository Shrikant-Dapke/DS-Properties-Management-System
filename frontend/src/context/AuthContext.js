import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
  });

  // Set axios defaults
  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common['x-auth-token'] = auth.token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [auth.token]);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      if (auth.token) {
        try {
          const res = await axios.get('/api/auth/me');
          setAuth({
            ...auth,
            isAuthenticated: true,
            loading: false,
            user: res.data
          });
        } catch (err) {
          setAuth({
            ...auth,
            isAuthenticated: false,
            loading: false,
            user: null
          });
        }
      } else {
        setAuth({
          ...auth,
          isAuthenticated: false,
          loading: false,
          user: null
        });
      }
    };

    loadUser();
  }, [auth.token]);

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      
      setAuth({
        ...auth,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
        user: res.data.user
      });
      
      return { success: true };
    } catch (err) {
      localStorage.removeItem('token');
      
      setAuth({
        ...auth,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      });
      
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      
      localStorage.setItem('token', res.data.token);
      
      setAuth({
        ...auth,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
        user: res.data.user
      });
      
      return { success: true };
    } catch (err) {
      localStorage.removeItem('token');
      
      setAuth({
        ...auth,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      });
      
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    
    setAuth({
      ...auth,
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null
    });
  };

  return (
    <AuthContext.Provider value={{
      ...auth,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;