/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("accessToken");
  });

  const loginContext = (tokens) => {
    localStorage.setItem("accessToken", tokens.accessToken);
    if(tokens.refreshToken) {
        localStorage.setItem("refreshToken", tokens.refreshToken);
    }
    setIsAuthenticated(true);
  };

  const logoutContext = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};

// Thêm custom hook useAuth ở đây để sửa lỗi
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};