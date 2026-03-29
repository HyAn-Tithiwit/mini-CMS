import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext();

// HÀM GIẢI MÃ TOKEN Ở FRONTEND (Để tự biết Role mà không cần gọi API)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra F5 tải lại trang
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = decodeJWT(token);
          
          // NẾU LÀ ADMIN VÀ EDITOR: Không gọi lấy Profile, tự gán thông tin
          if (decoded && (decoded.role === 'admin' || decoded.role === 'editor')) {
            setUser({ 
              _id: decoded.userId, 
              role: decoded.role, 
              username: decoded.role.toUpperCase() // Hiện chữ ADMIN hoặc EDITOR trên Header
            });
          } else {
            // CÁC ROLE KHÁC (Reader/Author): Gọi API lấy Profile bình thường
            const response = await authApi.getUserInfo();
            setUser(response.data || response.user || response); 
          }
        } catch (error) {
          console.error(error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  // Hàm Login
  const login = async (email, password) => {
    const tokenResponse = await authApi.login({ email, password });
    
    const token = tokenResponse.accessToken;
    localStorage.setItem('accessToken', token);
    if (tokenResponse.refreshToken) {
      localStorage.setItem('refreshToken', tokenResponse.refreshToken);
    }

    const decoded = decodeJWT(token);
    let userData;

    // NẾU LÀ ADMIN VÀ EDITOR: Tự động gán quyền, bỏ qua API lấy Profile
    if (decoded && (decoded.role === 'admin' || decoded.role === 'editor')) {
      userData = { 
        _id: decoded.userId, 
        role: decoded.role, 
        username: decoded.role.toUpperCase() 
      };
    } else {
      // Gọi API lấy thông tin
      const userInfoResponse = await authApi.getUserInfo();
      userData = userInfoResponse.data || userInfoResponse.user || userInfoResponse;
    }

    setUser(userData); 
    return userData; 
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout({ refreshToken }); 
      }
    } catch (error) {
      console.error(error);
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải được dùng trong AuthProvider");
  return context;
};