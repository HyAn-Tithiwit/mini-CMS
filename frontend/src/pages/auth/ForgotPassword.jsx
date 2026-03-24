import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Backend: auth.controller.js -> forgotPassword (nếu có)
      await axiosClient.post('/auth/forgot-password', { email });
      setMessage("Một email hướng dẫn đã được gửi tới địa chỉ của bạn.");
    } catch (err) {
      alert(err.response?.data?.message || "Không thể gửi yêu cầu khôi phục");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 border border-border rounded-2xl bg-card shadow-sm">
        <Link to="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
        </Link>
        <h2 className="text-2xl font-serif font-bold mb-2">Quên mật khẩu?</h2>
        <p className="text-muted-foreground mb-8 text-sm">Nhập email để nhận liên kết đặt lại mật khẩu.</p>
        
        {message ? (
          <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">{message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="email" required placeholder="Nhập email của bạn"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-background"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit" disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:opacity-90 disabled:opacity-50 transition-opacity flex justify-center"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Gửi yêu cầu khôi phục"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}