import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <div className="p-20 text-center">Vui lòng đăng nhập</div>;

  return (
    <div className="max-w-2xl mx-auto my-10 p-8 bg-white border rounded-xl shadow-sm">
      <h1 className="text-3xl font-serif mb-8 border-b pb-4">Thông tin cá nhân</h1>
      
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-full"><User className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Tên người dùng</p>
            <p className="font-medium text-lg">{user.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-full"><Mail className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-lg">{user.email || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-full"><Shield className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Vai trò hệ thống</p>
            <p className="font-medium capitalize px-2 py-1 bg-blue-50 text-blue-700 rounded w-fit text-sm">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}