import axios from 'axios';

function resolveBaseURL(){
  const envBase = import.meta.env.VITE_API_URL;
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const port = typeof window !== 'undefined' ? window.location.port : '';
  if(envBase) return envBase; // explicit URL (Render backend, etc.)
  const isDevVite = (!!port && /^51\d{2}$/.test(port)) || port === '4173' || port === '8080';
  if(isDevVite){
    const baseHost = host.startsWith('172.') ? 'localhost' : host;
    return `http://${baseHost}:4001`;
  }
  return '';
}

const api = axios.create({ baseURL: resolveBaseURL() });

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
if(token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export default api;