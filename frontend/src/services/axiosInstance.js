import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Asegúrate de que el puerto coincida con tu backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para inyectar el token en los headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;