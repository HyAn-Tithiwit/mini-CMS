import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/auth.api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: '', // <-- Đã thêm trường này để khớp với Backend
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Kiểm tra nhanh ở Frontend trước khi gửi lên Backend
    if (formData.password !== formData.confirmpassword) {
      setError('Mật khẩu xác nhận không khớp!');
      setIsLoading(false);
      return;
    }

    try {
      await authApi.register(formData);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra hoặc email đã được sử dụng!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '50px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Đăng Ký Tài Khoản</h2>
      
      <div style={{ backgroundColor: '#e9ecef', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', color: '#495057' }}>
        💡 <strong>Lưu ý:</strong> Tài khoản mới tạo sẽ mặc định là <strong>Độc giả (Reader)</strong>. Để có quyền viết bài, bạn có thể thăng cấp lên <strong>Tác giả (Author)</strong> hoàn toàn miễn phí tại trang Hồ Sơ (Profile) sau khi đăng nhập.
      </div>
      
      {error && <p style={{ color: 'red', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Tên hiển thị:</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
            placeholder="Ví dụ: Nguyễn Văn A..."
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="email@example.com"
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Mật khẩu:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            placeholder="Nhập ít nhất 6 ký tự..."
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        {/* <-- Bổ sung thêm Ô nhập Xác nhận mật khẩu --> */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold' }}>Xác nhận mật khẩu:</label>
          <input 
            type="password" 
            name="confirmpassword" 
            value={formData.confirmpassword} 
            onChange={handleChange} 
            required 
            placeholder="Nhập lại mật khẩu..."
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button disabled={isLoading} type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Ký Ngay'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        Đã có tài khoản? <Link to="/login" style={{ color: '#007BFF', fontWeight: 'bold', textDecoration: 'none' }}>Đăng nhập</Link>
      </p>
    </div>
  );
}