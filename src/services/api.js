import axios from "axios";
// import produtoService from './produtoService';

const api = axios.create({
  baseURL: "http://192.168.3.203:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
