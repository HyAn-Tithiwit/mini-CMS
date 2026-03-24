import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Users, FolderOpen, LogOut, ChevronLeft } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Kiểm tra quyền truy cập nhanh (RBAC)
  if (!user || (user.role === 'reader')) return <Navigate to="/" />;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Thống kê', path: '/dashboard', roles: ['admin'] },
    { icon: FileText, label: 'Bài viết', path: '/dashboard/posts', roles: ['admin', 'author', 'editor'] },
    { icon: FolderOpen, label: 'Danh mục', path: '/dashboard/categories', roles: ['admin', 'editor'] },
    { icon: Users, label: 'Người dùng', path: '/dashboard/users', roles: ['admin'] },
  ];

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <span className="font-serif font-bold text-xl">Mini CMS</span>
          <Link to="/" title="Về trang chủ"><ChevronLeft className="w-5 h-5"/></Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            item.roles.includes(user.role) && (
              <Link
                key={item.path} to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path ? 'bg-primary text-white' : 'hover:bg-muted'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </nav>
        <div className="p-4 border-t">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-2 w-full text-red-500 hover:bg-red-50 rounded-lg">
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-card border-b flex items-center justify-between px-8">
          <div className="font-medium">Dashboard / {user.role}</div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold">{user.name}</div>
              <div className="text-xs text-muted-foreground uppercase">{user.role}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}