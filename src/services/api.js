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

export default api;
