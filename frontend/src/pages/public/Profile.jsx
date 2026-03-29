import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';

export default function Profile() {
  const { user } = useAuth(); // Lấy thông tin user hiện tại và hàm cập nhật
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [message, setMessage] = useState('');

  // Nếu chưa load xong user thì báo chờ
  if (!user) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải thông tin... ⏳</div>;

  // Hàm xử lý khi bấm nút Nâng cấp
  const handleUpgradeRole = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn trở thành Tác giả để bắt đầu đăng bài không?')) return;
    
    setIsUpgrading(true);
    setMessage('');

    try {
      // 1. Gọi API đổi role trong Database
      await authApi.upgradeToAuthor();
      
      // 2. Ép xoá Token cũ (Vì Token cũ đang ghi nhớ Role = Reader)
      localStorage.removeItem('accessToken'); 
      // Xoá luôn RefreshToken để đảm bảo đăng nhập lại từ đầu cho sạch sẽ
      localStorage.removeItem('refreshToken');
      
      setMessage('🎉 Chúc mừng! Bạn đã chính thức trở thành Tác giả. Hệ thống sẽ tự động chuyển hướng để cập nhật quyền hạn mới...');
      
      // 3. Đợi 2 giây cho người dùng đọc dòng thông báo, sau đó đá họ ra trang Login
      setTimeout(() => {
        window.location.href = '/login'; 
      }, 2000);

    } catch (error) {
      console.error(error);
      setMessage('❌ Có lỗi xảy ra khi nâng cấp tài khoản. Vui lòng thử lại sau.');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
        👤 Hồ Sơ Cá Nhân
      </h2>
      
      {/* THÔNG TIN NGƯỜI DÙNG */}
      <div style={{ marginBottom: '25px', fontSize: '16px', lineHeight: '1.8' }}>
        <p><strong>Tên hiển thị:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p>
          <strong>Cấp bậc hiện tại:</strong> 
          <span style={{ 
            marginLeft: '10px', 
            padding: '4px 8px', 
            backgroundColor: user.role === 'admin' ? '#dc3545' : user.role === 'editor' ? '#ffc107' : user.role === 'author' ? '#17a2b8' : '#6c757d', 
            color: '#fff', 
            borderRadius: '4px',
            textTransform: 'uppercase',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {user.role}
          </span>
        </p>
      </div>

      {/* HIỂN THỊ THÔNG BÁO THÀNH CÔNG/THẤT BẠI */}
      {message && (
        <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '4px', backgroundColor: message.includes('🎉') ? '#d4edda' : '#f8d7da', color: message.includes('🎉') ? '#155724' : '#721c24', fontSize: '14.5px', lineHeight: '1.5' }}>
          {message}
        </div>
      )}

      {/* KHU VỰC CHUYÊN DỤNG: CHỈ HIỆN CHO ĐỘC GIẢ (READER) */}
      {user.role === 'reader' && (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ccc', textAlign: 'center' }}>
          <h3 style={{ marginTop: 0, fontSize: '18px', color: '#333' }}>✍️ Bạn muốn viết bài?</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px', lineHeight: '1.5' }}>
            Nâng cấp tài khoản lên <strong>Tác giả (Author)</strong> hoàn toàn miễn phí để bắt đầu chia sẻ câu chuyện và kiến thức của bạn với cộng đồng.
          </p>
          <button 
            onClick={handleUpgradeRole} 
            disabled={isUpgrading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: isUpgrading ? '#6c757d' : '#28a745', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isUpgrading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '15px',
              transition: 'all 0.3s'
            }}
          >
            {isUpgrading ? 'Đang xử lý...' : '🚀 Nâng cấp thành Tác giả ngay'}
          </button>
        </div>
      )}

      {/* LỜI NHẮN CHO CÁC ROLE QUẢN TRỊ (AUTHOR, EDITOR, ADMIN) */}
      {user.role !== 'reader' && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '6px', textAlign: 'center', color: '#495057', fontSize: '14px' }}>
          Bạn đang có quyền truy cập khu vực Quản trị. Hãy nhấp vào nút <strong>Dashboard</strong> trên thanh điều hướng phía trên để quản lý nội dung nhé.
        </div>
      )}
    </div>
  );
}