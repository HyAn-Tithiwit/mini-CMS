import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    try {
      // Gọi hàm login (nó sẽ tự xử lý việc lấy token và fetch user)
      const userData = await login(formData.email, formData.password);
      
      // Soi Role từ Backend để điều hướng
      const actualRole = userData?.role || 'reader'; 
      
      alert('Đăng nhập thành công!');
      
      // Điều hướng thông minh
      if (['admin', 'editor', 'author'].includes(actualRole)) {
        navigate('/dashboard/posts'); // Cấp quản lý/tác giả vào Dashboard
      } else {
        navigate('/'); // Độc giả ra trang chủ
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Sai email hoặc mật khẩu!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>Đăng Nhập</h2>
      
      {error && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="admin1@gmail.com"
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Mật khẩu:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            placeholder="Nhập mật khẩu..."
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          disabled={isLoading} 
          type="submit" 
          style={{ width: '100%', padding: '12px', backgroundColor: isLoading ? '#6c757d' : '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          {isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}
        </button>
      </form>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
        <Link to="/forgot-password" style={{ color: '#6c757d', textDecoration: 'none' }}>Quên mật khẩu?</Link>
        <Link to="/register" style={{ color: '#28a745', fontWeight: 'bold', textDecoration: 'none' }}>Đăng ký ngay</Link>
      </div>
    </div>
  );
}