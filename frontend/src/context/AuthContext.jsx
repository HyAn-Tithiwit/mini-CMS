import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/auth.api';

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo Provider để bọc toàn bộ App
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Lưu thông tin user
  const [loading, setLoading] = useState(true); // Trạng thái chờ load dữ liệu lúc mới vào web

  // Chạy 1 lần duy nhất khi user vừa mở web
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Nếu có token, gọi API lấy thông tin user để biết họ là ai (Admin, Reader, v.v.)
          const userInfo = await authApi.getUserInfo();
          setUser(userInfo.data); // Giả sử backend trả về { data: { id, name, role... } }
        } catch (error) {
          console.error('Token hết hạn hoặc lỗi:', error);
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
      setLoading(false); // Xong bước kiểm tra thì tắt loading
    };

    checkUserLoggedIn();
  }, []);

  // Hàm Đăng nhập (để dùng ở file Login.jsx)
  const login = async (email, password, roleType = 'reader') => {
    // roleType để phân biệt loginAdmin hay loginReader dựa vào backend của bạn
    let response;
    if (roleType === 'admin') {
      response = await authApi.loginAdmin({ email, password });
    } else {
      response = await authApi.loginReader({ email, password });
    }
    
    // Lưu token và set lại User
    localStorage.setItem('accessToken', response.token); // Đổi 'response.token' tuỳ data backend trả về
    setUser(response.user); 
    return response;
  };

  // Hàm Đăng xuất (để dùng ở Header.jsx)
  const logout = async () => {
    try {
      await authApi.logout(); // Báo cho backend biết
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children} 
      {/* Chỉ render các trang khi đã kiểm tra xong user */}
    </AuthContext.Provider>
  );
};

// 3. Tạo Hook Custom để các component khác gọi cho lẹ
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);