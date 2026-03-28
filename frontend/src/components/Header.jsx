import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth(); // Lấy user từ Context
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
      <div>
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>
          Blog-News
        </Link>
      </div>

      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Trang chủ</Link>
        <Link to="/search" style={{ textDecoration: 'none', color: '#333' }}>Tìm kiếm</Link>

        {/* Nếu chưa đăng nhập -> Hiện Đăng nhập / Đăng ký */}
        {!user ? (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#007BFF' }}>Đăng nhập</Link>
            <Link to="/register" style={{ textDecoration: 'none', color: '#28a745' }}>Đăng ký</Link>
          </>
        ) : (
          /* Nếu ĐÃ đăng nhập -> Hiện Tên user và nút Đăng xuất */
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>Chào, {user.username}</span>
            
            {/* Nếu là Admin, Editor, Author thì cho hiện link vào Dashboard */}
            {['admin', 'editor', 'author'].includes(user.role) && (
              <Link to="/dashboard/posts" style={{ textDecoration: 'none', color: '#17a2b8' }}>Vào Dashboard</Link>
            )}

            <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              Đăng xuất
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}