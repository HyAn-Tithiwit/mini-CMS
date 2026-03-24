import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components & Layouts
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import PrivateRoute from './routes/PrivateRoute';

// Public Pages
import Home from './pages/public/Home';
import Category from './pages/public/Category';
import ArticleDetail from './pages/public/ArticleDetail';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Routes>
            {/* 1. PUBLIC ROUTES (Có Header/Footer) */}
            <Route element={<><Header /><main className="flex-1"><Outlet /></main><Footer /></>}>
              <Route path="/" element={<Home />} />
              <Route path="/category/:slug" element={<Category />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/search" element={<div>Trang tìm kiếm (Nhóm 2)</div>} />
            </Route>

            {/* 2. DASHBOARD ROUTES (Private & Admin Layout) */}
            <Route element={<PrivateRoute allowedRoles={['admin', 'author', 'editor']} />}>
              <Route path="/dashboard" element={<AdminLayout />}>
                <Route index element={<div className="p-10 border-2 border-dashed rounded-xl text-muted-foreground text-center">Chào mừng đến với hệ thống CMS</div>} />
                <Route path="posts" element={<div>Danh sách bài viết (Nhóm 3)</div>} />
                
                {/* Chỉ Admin */}
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                  <Route path="users" element={<div>Quản lý người dùng (Nhóm 4)</div>} />
                  <Route path="categories" element={<div>Quản lý danh mục (Nhóm 4)</div>} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Cần thêm Outlet để lồng các route public vào layout chung
import { Outlet } from 'react-router-dom';
export default App;