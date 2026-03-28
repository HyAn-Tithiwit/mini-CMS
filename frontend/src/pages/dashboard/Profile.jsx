import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';

export default function Profile() {
  const { setUser } = useAuth();
  
  // Quản lý trạng thái trang
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false); // Trạng thái khi bấm nút Nâng cấp
  
  // State cho Form đổi tên (Chuẩn bị sẵn cho tương lai)
  const [username, setUsername] = useState('');

  // 1. Gọi API lấy thông tin mới nhất của User khi vào trang
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authApi.getUserInfo();
      
      // Xử lý dữ liệu trả về (tuỳ format của backend bạn)
      const data = response.data || response.user || response;
      setProfileData(data);
      setUsername(data.username || ''); // Đổ tên cũ vào ô input
      
    } catch (error) {
      console.error('Lỗi khi tải thông tin cá nhân:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 2. Hàm xử lý Nâng cấp lên Tác giả (Author)
  const handleUpgradeToAuthor = async () => {
    const confirmUpgrade = window.confirm("Bạn có chắc chắn muốn nâng cấp tài khoản thành Tác giả (Author) để đăng bài không?");
    if (!confirmUpgrade) return;

    try {
      setIsUpgrading(true);
      // Gọi API nâng cấp role
      await authApi.upgradeToAuthor();
      
      alert('🎉 Chúc mừng! Bạn đã trở thành Tác giả. Bây giờ bạn có thể đăng bài viết mới.');
      
      // Sau khi nâng cấp thành công trên backend, ta phải tải lại data mới
      await fetchProfile();
      
      // Đồng thời cập nhật lại cái Context (Header sẽ tự đổi theo)
      setUser(prev => ({ ...prev, role: 'author' }));

    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi nâng cấp tài khoản.');
    } finally {
      setIsUpgrading(false);
    }
  };

  // 3. Hàm xử lý Đổi tên (Tạm thời giả lập vì backend chưa có API)
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert("⚠️ Tính năng đổi tên đang chờ Backend bổ sung API. Hiện tại backend của bạn chưa cung cấp API để user tự cập nhật thông tin.");
  };

  // Giao diện khi đang tải
  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải thông tin cá nhân... ⏳</div>;
  if (!profileData) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Không thể tải thông tin. Vui lòng đăng nhập lại!</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Hồ Sơ Của Bạn</h2>

      {/* --- PHẦN 1: NÂNG CẤP TÀI KHOẢN --- */}
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e9ecef' }}>
        <h3 style={{ marginTop: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Loại tài khoản hiện tại: 
          <span style={{ 
            padding: '5px 10px', 
            backgroundColor: profileData.role === 'reader' ? '#6c757d' : '#28a745', 
            color: 'white', 
            borderRadius: '20px', 
            fontSize: '14px',
            textTransform: 'uppercase'
          }}>
            {profileData.role || 'reader'}
          </span>
        </h3>

        {/* Nếu là Độc giả (Reader) -> Hiện nút nâng cấp */}
        {profileData.role === 'reader' && (
          <div style={{ marginTop: '15px' }}>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '15px' }}>
              Trở thành <strong>Tác giả (Author)</strong> để chia sẻ bài viết, ý tưởng và câu chuyện của bạn đến với cộng đồng. Nhấn nút bên dưới để nâng cấp ngay (Hoàn toàn miễn phí).
            </p>
            <button 
              onClick={handleUpgradeToAuthor}
              disabled={isUpgrading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: isUpgrading ? '#6c757d' : '#ffc107',
                color: '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: isUpgrading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              {isUpgrading ? 'Đang xử lý...' : '🚀 Nâng cấp lên Tác giả ngay'}
            </button>
          </div>
        )}

        {/* Nếu đã là Tác giả/Editor/Admin -> Báo tin vui */}
        {['author', 'editor', 'admin'].includes(profileData.role) && (
          <p style={{ color: '#28a745', fontWeight: 'bold', marginTop: '10px', marginBottom: 0 }}>
            ✨ Bạn đã có quyền đăng và quản lý bài viết trong hệ thống.
          </p>
        )}
      </div>

      <hr style={{ borderTop: '1px solid #eee', marginBottom: '30px' }} />

      {/* --- PHẦN 2: THÔNG TIN CÁ NHÂN (FORM ĐỔI TÊN) --- */}
      <form onSubmit={handleUpdateProfile}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email (Không thể thay đổi):</label>
          <input 
            type="email" 
            value={profileData.email || ''} 
            disabled 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#e9ecef', color: '#666', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Tên hiển thị:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên mới của bạn..."
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#007BFF', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
          Lưu thay đổi hồ sơ
        </button>
      </form>

    </div>
  );
}