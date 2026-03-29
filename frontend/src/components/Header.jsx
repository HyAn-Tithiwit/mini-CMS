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
          /* Nếu ĐÃ đăng nhập -> Hiện Tên user, nút Profile và nút Đăng xuất */
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Chào, {user.username}</span>
            
            {/* ---> ĐÃ BỔ SUNG NÚT PROFILE VÀO ĐÂY <--- */}
            <Link to="/profile" style={{ textDecoration: 'none', color: '#28a745', fontWeight: '500' }}>
              👤 Hồ sơ
            </Link>

            {['admin', 'editor', 'author'].includes(user.role) && (
              <Link to="/dashboard/posts" style={{ textDecoration: 'none', color: '#17a2b8', fontWeight: '500' }}>
                ⚙️ Dashboard
              </Link>
            )}

            {/* BỔ SUNG: Nút Duyệt Bài chỉ xuất hiện cho Admin và Editor */}
            {['admin', 'editor'].includes(user.role) && (
              <Link to="/dashboard/review" style={{ textDecoration: 'none', color: '#ffc107', fontWeight: 'bold', padding: '4px 8px', border: '1px solid #ffc107', borderRadius: '4px' }}>
                🛡️ Duyệt Bài
              </Link>
            )}

            <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
              Đăng xuất
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}