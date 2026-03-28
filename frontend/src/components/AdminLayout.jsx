import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      
      {/* --- SIDEBAR (THANH MENU BÊN TRÁI) --- */}
      <aside style={{ width: '250px', backgroundColor: '#343a40', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #4f5962' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#fff' }}>Hệ Thống CMS</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#adb5bd' }}>
            Vai trò: <span style={{ textTransform: 'uppercase', color: '#ffc107', fontWeight: 'bold' }}>{user?.role}</span>
          </p>
        </div>

        <nav style={{ flex: 1, padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <Link to="/dashboard/posts" style={navItemStyle}>📝 Quản lý bài viết</Link>
          
          {/* Chỉ Admin hoặc Editor mới thấy Quản lý Danh mục & Thẻ */}
          {['admin', 'editor'].includes(user?.role) && (
            <>
              <Link to="/dashboard/categories" style={navItemStyle}>📁 Quản lý Danh mục</Link>
              <Link to="/dashboard/tags" style={navItemStyle}>🏷️ Quản lý Thẻ (Tags)</Link>
            </>
          )}

          {/* Chỉ Admin mới thấy Quản lý User */}
          {user?.role === 'admin' && (
            <Link to="/dashboard/users" style={navItemStyle}>👥 Quản lý Người dùng</Link>
          )}

          <Link to="/profile" style={navItemStyle}>👤 Hồ sơ của tôi</Link>
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #4f5962' }}>
          <Link to="/" style={{ ...navItemStyle, color: '#17a2b8', marginBottom: '10px' }}>🌍 Ra ngoài Trang chủ</Link>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT (NỘI DUNG CHÍNH BÊN PHẢI) --- */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar nhỏ bên trên */}
        <header style={{ backgroundColor: '#fff', padding: '15px 30px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', color: '#333' }}>Xin chào, {user?.username || 'Bạn'}! 👋</span>
        </header>

        {/* Khu vực render nội dung các trang con (PostList, CreatePost...) */}
        <div style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
          <Outlet /> {/* <-- ĐÂY LÀ PHÉP THUẬT CỦA REACT ROUTER */}
        </div>
      </main>

    </div>
  );
}

// Style tái sử dụng cho các link trong menu
const navItemStyle = {
  display: 'block',
  padding: '12px 20px',
  color: '#c2c7d0',
  textDecoration: 'none',
  fontSize: '16px',
  transition: 'background 0.3s',
};