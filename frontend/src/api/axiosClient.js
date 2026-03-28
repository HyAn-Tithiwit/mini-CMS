import axios from 'axios';

// 1. Khởi tạo instance cơ bản
const axiosClient = axios.create({
  // Sử dụng biến môi trường của Vite thay vì gõ cứng URL
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 2. Interceptor GỬI ĐI: Tự động nhét Access Token vào header
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

// 3. Interceptor NHẬN VỀ: Xử lý lỗi Token hết hạn (401)
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu request thành công, chỉ lấy data (bỏ qua các thông tin config lằng nhằng của axios)
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu lỗi 401 (Hết hạn token) và chưa thử refresh lại token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi API refresh token của bạn
        const res = await axiosClient.post('/auth/refresh-new-token');
        const newAccessToken = res.data.accessToken; // Tùy format backend trả về
        
        // Lưu token mới
        localStorage.setItem('accessToken', newAccessToken);
        
        // Sửa lại header và thử gọi lại API bị lỗi ban nãy
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token cũng hết hạn -> Bắt user đăng nhập lại
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;