import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // F5 load lại trang -> Kiểm tra xem còn token không
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Dùng token hiện tại để lấy thông tin user
          const response = await authApi.getUserInfo();
          setUser(response.data || response.user || response); 
        } catch (error) {
          console.error('Lỗi hoặc Token hết hạn:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  // HÀM ĐĂNG NHẬP 2 BƯỚC
  const login = async (email, password) => {
    // Bước 1: Gửi email/pass lấy tokens từ Backend
    const tokenResponse = await authApi.login({ email, password });
    
    // Lưu tokens vào localStorage ngay lập tức để axiosClient tự động đính kèm vào header
    localStorage.setItem('accessToken', tokenResponse.accessToken);
    if (tokenResponse.refreshToken) {
      localStorage.setItem('refreshToken', tokenResponse.refreshToken);
    }

    // Bước 2: Gọi API lấy profile để biết User này là ai (Role gì)
    const userInfoResponse = await authApi.getUserInfo();
    const userData = userInfoResponse.data || userInfoResponse.user || userInfoResponse;

    // Lưu vào state
    setUser(userData); 
    
    // Trả về userData cho giao diện Login xử lý chuyển hướng
    return userData; 
  };

  // HÀM ĐĂNG XUẤT
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      // Backend của bạn yêu cầu truyền refreshToken vào body
      if (refreshToken) {
        await authApi.logout({ refreshToken }); 
      }
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

// Hook tuỳ chỉnh
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng trong AuthProvider");
  }
  return context;
};