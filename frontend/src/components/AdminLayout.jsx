import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Tự động đẩy người dùng về đúng trang chức năng của họ
  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      if (user?.role === 'editor') navigate('/dashboard/review', { replace: true });
      else if (user?.role === 'admin') navigate('/dashboard/users', { replace: true });
      else if (user?.role === 'author') navigate('/dashboard/posts', { replace: true });
    }
  }, [location, navigate, user]);

  const navItemStyle = {
    padding: '12px 20px',
    color: '#c2c7d0',
    textDecoration: 'none',
    display: 'block',
    borderBottom: '1px solid #4f5962',
    transition: '0.3s',
    fontWeight: '500'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      
      <aside style={{ width: '250px', backgroundColor: '#343a40', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #4f5962' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#fff' }}>Hệ Thống CMS</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#adb5bd' }}>
            Vai trò: <span style={{ textTransform: 'uppercase', color: '#ffc107', fontWeight: 'bold' }}>{user?.role}</span>
          </p>
        </div>

        <nav style={{ flex: 1, padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          
          {/* CHỈ EDITOR mới có quyền Duyệt Bài */}
          {user?.role === 'editor' && (
            <Link to="/dashboard/review" style={navItemStyle}>🛡️ Duyệt Bài Viết</Link>
          )}

          {/* CHỈ AUTHOR mới có quyền Quản lý bài viết cá nhân */}
          {user?.role === 'author' && (
            <Link to="/dashboard/posts" style={navItemStyle}>📝 Quản lý bài viết</Link>
          )}
          
          {/* 🎯 ĐÃ SỬA: Cả ADMIN và EDITOR đều thấy Quản lý Danh mục & Thẻ */}
          {['admin', 'editor'].includes(user?.role) && (
            <>
              <Link to="/dashboard/categories" style={navItemStyle}>📁 Quản lý Danh mục</Link>
              <Link to="/dashboard/tags" style={navItemStyle}>🏷️ Quản lý Thẻ (Tags)</Link>
            </>
          )}

          {/* CHỈ ADMIN mới có quyền Quản lý Người dùng */}
          {user?.role === 'admin' && (
            <Link to="/dashboard/users" style={navItemStyle}>👑 Quản lý Người dùng</Link>
          )}

          <Link to="/dashboard/profile" style={navItemStyle}>👤 Hồ sơ của tôi</Link>
        </nav>
        
        <div style={{ padding: '20px', borderTop: '1px solid #4f5962', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link 
            to="/" 
            style={{ display: 'block', width: '100%', padding: '10px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold' }}>
            🏠 Về Trang Chủ
          </Link>
          <button 
            onClick={handleLogout} 
            style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Đăng xuất
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <Outlet /> 
      </main>
    </div>
  );
}