import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token }); 
    }
    setLoading(false);
  }, []);

  const login = async (email, contrasena) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, contrasena });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      setUser({ token });
      
      return { success: true };
    } catch (error) {
       const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error al iniciar sesión';
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};