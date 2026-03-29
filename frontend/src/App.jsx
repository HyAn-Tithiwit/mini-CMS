import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'; // <-- Đã thêm Outlet vào đây
import { AuthProvider } from './context/AuthContext';
import ArticleDetail from './pages/public/ArticleDetail';

// Components & Layouts
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import PrivateRoute from './routes/PrivateRoute';

// Public Pages
import Home from './pages/public/Home';
import CategoryPublic from './pages/public/Category'; // Đổi tên import để tránh trùng với Category của Admin
import Search from './pages/public/Search'; // <-- THÊM IMPORT SEARCH

// Auth Pages & Profile
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Profile from './pages/public/Profile'; // (Lưu ý: Ở các bài trước mình để Profile trong dashboard, nếu bạn để ở public thì cứ giữ nguyên nhé)

// Dashboard Pages (Vùng quản trị) <-- THÊM CÁC IMPORT NÀY
import PostList from './pages/dashboard/posts/PostList';
import CreatePost from './pages/dashboard/posts/CreatePost';
import CategoryAdmin from './pages/dashboard/Category';
import TagAdmin from './pages/dashboard/Tag';
import UserManagement from './pages/dashboard/UserManagement';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Routes>
            
            {/* 1. PUBLIC ROUTES (Có Header/Footer) */}
            <Route element={<><Header /><main className="flex-1"><Outlet /></main><Footer /></>}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} /> 
              <Route path="/category/:slug" element={<CategoryPublic />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/search" element={<Search />} /> {/* <-- ĐÃ CẬP NHẬT TRANG TÌM KIẾM */}
              <Route path="/post/:id" element={<ArticleDetail />} />
            </Route>

            {/* 2. DASHBOARD ROUTES (Private & Admin Layout) */}
            {/* Lưu ý: Để cú pháp <Route element={<PrivateRoute />}> hoạt động, trong file PrivateRoute.jsx bạn phải return <Outlet /> nhé */}
            <Route element={<PrivateRoute allowedRoles={['admin', 'author', 'editor']} />}>
              <Route path="/dashboard" element={<AdminLayout />}>
                
                {/* Trang chủ của Dashboard */}
                <Route index element={<div className="p-10 border-2 border-dashed rounded-xl text-muted-foreground text-center">Chào mừng đến với hệ thống CMS</div>} />
                
                {/* Quản lý bài viết (Ai cũng vào được nếu qua được PrivateRoute bên trên) */}
                <Route path="posts" element={<PostList />} /> {/* <-- ĐÃ CẬP NHẬT */}
                <Route path="posts/create" element={<CreatePost />} /> {/* <-- THÊM TẠO BÀI */}
                <Route path="posts/edit/:id" element={<CreatePost />} /> {/* <-- THÊM SỬA BÀI */}
                
                {/* Chỉ Admin và Editor mới quản lý Category & Tag */}
                <Route element={<PrivateRoute allowedRoles={['admin', 'editor']} />}>
                  <Route path="categories" element={<CategoryAdmin />} /> {/* <-- ĐÃ CẬP NHẬT */}
                  <Route path="tags" element={<TagAdmin />} /> {/* <-- ĐÃ CẬP NHẬT */}
                </Route>

                {/* Chỉ Admin mới quản lý Users */}
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                  <Route path="users" element={<UserManagement />} /> {/* <-- ĐÃ CẬP NHẬT */}
                </Route>

              </Route>
            </Route>

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;