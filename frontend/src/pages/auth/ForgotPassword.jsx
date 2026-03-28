import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // TẠM THỜI GIẢ LẬP GỌI API (Chờ Backend làm api gửi mail)
      // await authApi.forgotPassword(email);
      
      setTimeout(() => {
        setMessage('✅ Nếu email hợp lệ, một liên kết đặt lại mật khẩu đã được gửi đến hộp thư của bạn. Vui lòng kiểm tra!');
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error(error);
      setMessage('❌ Có lỗi xảy ra, vui lòng thử lại sau.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>Quên Mật Khẩu?</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '25px', fontSize: '14px' }}>
        Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục tài khoản.
      </p>

      {message && (
        <div style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24', fontSize: '14px' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Địa chỉ Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Nhập email đã đăng ký..."
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !email}
          style={{ width: '100%', padding: '12px', backgroundColor: isLoading ? '#6c757d' : '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
        >
          {isLoading ? 'Đang gửi yêu cầu...' : 'Gửi Link Khôi Phục'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        <Link to="/login" style={{ color: '#007BFF', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Quay lại Đăng nhập
        </Link>
      </div>
    </div>
  );
}