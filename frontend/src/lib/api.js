import axios from 'axios';

function resolveBaseURL(){
  const envBase = import.meta.env.VITE_API_URL;
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const port = typeof window !== 'undefined' ? window.location.port : '';
  if(envBase) return envBase; // explicit URL (Render backend, etc.)
  const isDevVite = (!!port && /^51\d{2}$/.test(port)) || port === '4173' || port === '8080';
  if(isDevVite){
    const baseHost = host; // usa o mesmo host acessado no frontend
    return `http://${baseHost}:4001`;
  }
  return '';
}

const api = axios.create({ baseURL: resolveBaseURL() });

api.interceptors.request.use((config)=>{
  if(typeof window !== 'undefined'){
    const t = localStorage.getItem('token');
    if(t) config.headers = { ...(config.headers||{}), Authorization: `Bearer ${t}` };
  }
  return config;
});

export default api;
export function resolveUrl(u){
  if(!u) return u;
  if(typeof u === 'string' && u.startsWith('/')) return `${api.defaults.baseURL||''}${u}`;
  return u;
}