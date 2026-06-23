import axios from 'axios';

// Use VITE_API_URL for production, fallback to '' for dev (Vite proxy)
// Dipakai juga oleh file-file yang masih memakai fetch() mentah, supaya
// semua request (axios maupun fetch) konsisten menuju backend yang benar.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

const baseURL = API_BASE_URL || '/';

// Create axios instance with default config
const api = axios.create({
  baseURL,
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.config?.url);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.warn('Authentication failed, removing token and redirecting to login');
      localStorage.removeItem('token');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - backend may be offline:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;