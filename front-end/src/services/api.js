import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const login = (username, password) => API.post('/auth/login', { username, password });
export const fetchLogs = (params) => API.get('/logs', { params });
export const fetchUsers = () => API.get('/users');
export default API;
