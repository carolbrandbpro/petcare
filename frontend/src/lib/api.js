import axios from 'axios';

function resolveBaseURL(){
  const envBase = import.meta.env.VITE_API_URL;
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  let apiBase = envBase || `http://${host}:4001`;
  if(envBase && envBase.includes('backend')){
    if(host === 'localhost' || host.startsWith('172.')) apiBase = 'http://localhost:4001';
  }
  if(host.startsWith('172.')) apiBase = 'http://localhost:4001';
  return apiBase;
}

const api = axios.create({ baseURL: resolveBaseURL() });

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
if(token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export default api;