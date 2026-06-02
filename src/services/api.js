import axios from "axios";

const isDevelopment = import.meta.env.MODE === 'development';

export const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (isDevelopment
    ? 'http://192.168.3.203:3000'
    : 'https://stock-api-production.up.railway.app'
  );

export function buildFileUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const cleanPath = path.replace(/^uploads\//, '');
  return `${API_BASE_URL}/uploads/${cleanPath}`;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Injeta o token em toda requisição a partir do localStorage
// Garante que o header esteja presente mesmo após reload da página
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Evita cache de GET em ambiente local (MariaDB/HTTP)
  // Só aplica quando não é uma requisição multipart (upload de foto)
  if (config.method === 'get' && !config.headers['Content-Type']?.includes('multipart')) {
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
  }

  return config;
});

// Redireciona para login quando o token expira ou é inválido (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
