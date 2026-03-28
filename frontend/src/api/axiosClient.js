import axios from 'axios';

// Dùng URL từ .env, nếu không có thì mặc định port 3000
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Tự động đính kèm Token trước khi gửi
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Bắt lỗi khi nhận response
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // SỬA Ở ĐÂY: Bỏ qua không xin lại token nếu đang ở API /auth/login
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error("Không có refresh token");

        // Dùng axios gốc để không bị kẹt vào vòng lặp
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { 
          refreshToken: refreshToken 
        });
        
        const newAccessToken = res.data.accessToken; 
        localStorage.setItem('accessToken', newAccessToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
        
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Chỉ reload trang nếu user không phải đang ở sẵn trang login
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;