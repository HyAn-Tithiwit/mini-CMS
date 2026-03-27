import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:3000/api', // Thay localhost -> 127.0.0.1
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động gắn Access Token vào mỗi request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;