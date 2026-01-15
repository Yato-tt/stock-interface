const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.3.203:3000';

/**
 * Constrói URL completa para imagens
 * @param {string} path - Caminho da imagem (ex: "uploads/profiles/foto.jpg")
 * @returns {string|null} URL completa ou null
 */
export function getImageUrl(path) {
  if (!path) return null;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.replace(/^uploads\//, '');

  return `${API_BASE_URL}/uploads/${cleanPath}`;
}
