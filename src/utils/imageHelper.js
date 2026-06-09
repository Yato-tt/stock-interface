// Usa a mesma base URL do api.js para garantir consistência entre ambientes
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'development'
    ? 'http://192.168.3.203:3000'
    : 'https://stock-api-production.up.railway.app');

export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const cleanPath = path.replace(/^uploads\//, '');
  return `${API_BASE_URL}/uploads/${cleanPath}`;
}
