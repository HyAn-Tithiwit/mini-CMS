import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden"><Menu className="w-6 h-6" /></button>
            <Link to="/search" className="hover:bg-gray-100 p-2 rounded-full transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
          
          <Link to="/" className="text-3xl font-serif tracking-tight">The Chronicle</Link>
          
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right border-r pr-4">
                  <p className="text-sm font-bold leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <div className="flex gap-2">
                  {user.role !== 'reader' && (
                    <Link to="/dashboard" className="p-2 hover:bg-muted rounded-full" title="Dashboard">
                      <LayoutDashboard className="w-5 h-5" />
                    </Link>
                  )}
                  <button onClick={logout} className="p-2 hover:bg-red-50 text-red-500 rounded-full" title="Đăng xuất">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-primary">Đăng nhập</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-full hover:opacity-90">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
        
        <nav className="border-t border-border">
          <ul className="flex items-center justify-center gap-8 py-3 text-sm overflow-x-auto no-scrollbar">
            <li><Link className="hover:text-primary transition-colors font-medium" to="/">Home</Link></li>
            {['Technology', 'World', 'Politics', 'Business', 'Science', 'Health', 'Sports', 'Culture'].map((cat) => (
              <li key={cat}><Link className="hover:text-primary transition-colors text-muted-foreground capitalize" to={`/category/${cat.toLowerCase()}`}>{cat}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}