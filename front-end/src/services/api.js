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

API.login = (username, password) => API.post('/auth/login', { username, password });
API.fetchLogs = (params) => API.get('/logs', { params });
API.fetchUsers = () => API.get('/users');

export default API;