import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Lấy hàm login cực xịn từ AuthContext chúng ta đã viết

  // Quản lý dữ liệu người dùng nhập vào
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    roleType: 'reader', // Mặc định cho phép đăng nhập như độc giả bình thường
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý khi user gõ vào input hoặc chọn radio button
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Xử lý khi bấm nút Đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Gọi hàm login từ AuthContext (nó sẽ tự gọi đúng API và lưu Token cho mình)
      await login(formData.email, formData.password, formData.roleType);
      alert('Đăng nhập thành công!');      
      
      // Chuyển hướng thông minh dựa vào phân quyền
      if (formData.roleType === 'admin') {
        navigate('/dashboard/posts'); // Quản trị viên/Tác giả thì đẩy vào Dashboard
      } else {
        navigate('/'); // Độc giả thì đẩy ra Trang chủ đọc báo
      }
      
    } catch (err) {
      // Bắt lỗi (sai pass, không tìm thấy user...) từ backend trả về
      setError(err.response?.data?.message || 'Sai email hoặc mật khẩu. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Đăng Nhập</h2>
      
      {/* Hiển thị lỗi nếu có */}
      {error && <div style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="Nhập email của bạn..."
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
            placeholder="Nhập mật khẩu..."
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        {/* Khu vực chọn loại tài khoản đăng nhập */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Bạn là:</label>
          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={{ cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="roleType" 
                value="reader" 
                checked={formData.roleType === 'reader'} 
                onChange={handleChange} 
              /> Độc giả
            </label>
            <label style={{ cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="roleType" 
                value="admin" 
                checked={formData.roleType === 'admin'} 
                onChange={handleChange} 
              /> Admin / Tác giả
            </label>
          </div>
        </div>

        <button 
          disabled={isLoading} 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: isLoading ? '#6c757d' : '#007BFF', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}>
          {isLoading ? 'Đang kiểm tra...' : 'Đăng Nhập'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        <p style={{ marginBottom: '5px' }}>
          <Link to="/forgot-password" style={{ color: '#007BFF', textDecoration: 'none' }}>Quên mật khẩu?</Link>
        </p>
        <p>
          Chưa có tài khoản? <Link to="/register" style={{ color: '#28a745', fontWeight: 'bold', textDecoration: 'none' }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}