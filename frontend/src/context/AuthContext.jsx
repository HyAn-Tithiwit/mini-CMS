import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Backend: auth.controller.js -> getMe
        const res = await axiosClient.get('/auth/me');
        setUser(res.data.data);
      } catch {
        // Thay 'err' bằng trống để hết lỗi no-unused-vars
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Backend: auth.controller.js -> login
    const res = await axiosClient.post('/auth/login', { email, password });
    setUser(res.data.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Vẫn giữ export ở đây, nếu ESLint vẫn báo đỏ ở dòng này, 
// bạn có thể thêm dòng comment disable ngay phía trên nó.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);