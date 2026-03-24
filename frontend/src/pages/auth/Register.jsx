import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosClient.post('/auth/register', formData);
      alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Đăng ký thất bại. Email có thể đã tồn tại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 border border-border rounded-2xl bg-card shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold">Tạo tài khoản</h2>
          <p className="text-muted-foreground mt-2">Tham gia cộng đồng The Chronicle</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text" required placeholder="Họ và tên"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="email" required placeholder="Email"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="password" required placeholder="Mật khẩu"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Đăng ký"}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Đã có tài khoản? <Link to="/login" className="text-primary hover:underline font-medium">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}