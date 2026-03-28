import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Lấy mã token từ đường dẫn URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsLoading(true);

    try {
      // TẠM THỜI GIẢ LẬP GỌI API (Chờ Backend làm api reset)
      // await authApi.resetPassword({ token, newPassword: password });
      
      setTimeout(() => {
        alert('Cập nhật mật khẩu thành công! Vui lòng đăng nhập lại.');
        navigate('/login');
      }, 1500);

    } catch (error) {
      console.error(error);
      setError('Đường dẫn không hợp lệ hoặc đã hết hạn.');
      setIsLoading(false);
    }
  };

  // Nếu người dùng vô tình vào thẳng trang này mà không có token từ email
  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2 style={{ color: 'red' }}>Đường dẫn không hợp lệ</h2>
        <p>Vui lòng kiểm tra lại email hoặc yêu cầu gửi lại link khôi phục.</p>
        <Link to="/forgot-password">Yêu cầu cấp lại link</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Tạo Mật Khẩu Mới</h2>
      
      {error && <div style={{ color: 'red', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Mật khẩu mới:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Nhập ít nhất 6 ký tự..."
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Xác nhận mật khẩu:</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Nhập lại mật khẩu mới..."
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !password || !confirmPassword}
          style={{ width: '100%', padding: '12px', backgroundColor: isLoading ? '#6c757d' : '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
        >
          {isLoading ? 'Đang lưu...' : 'Lưu Mật Khẩu Mới'}
        </button>
      </form>
    </div>
  );
}