import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// allowedRoles là mảng chứa các quyền được phép vào route này (VD: ['admin', 'editor', 'author'])
export default function PrivateRoute({ allowedRoles }) {
  const { user } = useAuth();

  // Nếu chưa đăng nhập -> đuổi ra trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập nhưng KHÔNG có quyền (role không nằm trong mảng allowedRoles)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Đuổi về trang chủ
  }

  // Nếu hợp lệ hết thì cho phép hiển thị các component con bên trong (thông qua Outlet)
  return <Outlet />;
}