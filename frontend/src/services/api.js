import axios from 'axios';

// Base URL points to /api by default, proxied via Vite dev server to backend port 6789
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tvarita_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unpack data and normalize error messages
api.interceptors.response.use(
  (response) => {
    // If backend uses { success: true, data: ... } or direct data, return standard payload
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    // If 401 Unauthorized occurs on protected routes (not login), could dispatch event
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      console.warn('Session expired or unauthorized request. Token may be invalid.');
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
