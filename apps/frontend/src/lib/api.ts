import axios from 'axios';
import { useAuthStore } from '../store/auth';

// Detect backend URL dynamically based on where the browser is loading the page from.
// If we load from 100.100.28.107:5173, backend is at 100.100.28.107:3000.
const backendUrl = import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')
  ? import.meta.env.VITE_API_URL 
  : `http://${window.location.hostname}:3000`;

export const api = axios.create({
  baseURL: backendUrl,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
