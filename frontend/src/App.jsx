import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext';
import ArticleDetail from './pages/public/ArticleDetail';

// Components & Layouts
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import PrivateRoute from './routes/PrivateRoute';

// Public Pages
import Home from './pages/public/Home';
import CategoryPublic from './pages/public/Category'; 
import Search from './pages/public/Search'; 
import Bookmarks from './pages/public/Bookmarks'; // Hoặc đường dẫn tương ứng của bạn

// Auth Pages & Profile
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Profile from './pages/public/Profile'; 

// Dashboard Pages
import PostList from './pages/dashboard/posts/PostList';
import CreatePost from './pages/dashboard/posts/CreatePost';
import CategoryAdmin from './pages/dashboard/Category';
import TagAdmin from './pages/dashboard/Tag';
import UserManagement from './pages/dashboard/UserManagement';
import ReviewList from './pages/dashboard/posts/ReviewList';

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
              <Route path="/search" element={<Search />} /> 
              <Route path="/post/:id" element={<ArticleDetail />} />
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} /> 
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Route>

            {/* 2. DASHBOARD ROUTES (Private & Admin Layout) */}
            <Route element={<PrivateRoute allowedRoles={['admin', 'author', 'editor']} />}>
              <Route path="/dashboard" element={<AdminLayout />}>
                
                {/* Trang chủ của Dashboard */}
                <Route index element={<div className="p-10 border-2 border-dashed rounded-xl text-muted-foreground text-center">Chào mừng đến với hệ thống CMS</div>} />
                
                {/* Khu vực của Author */}
                <Route path="posts" element={<PostList />} /> 
                <Route path="posts/create" element={<CreatePost />} /> 
                <Route path="posts/edit/:id" element={<CreatePost />} /> 
                
                {/* Khu vực của Admin */}
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                  <Route path="users" element={<UserManagement />} /> 
                </Route>

                {/* Khu vực dùng chung của Admin và Editor */}
                <Route element={<PrivateRoute allowedRoles={['admin', 'editor']} />}>
                  {/* 🎯 ĐÃ SỬA CHÍNH TẢ: Thêm chữ 's' vào cuối để khớp với Link trong Sidebar */}
                  <Route path="categories" element={<CategoryAdmin />} /> 
                  <Route path="tags" element={<TagAdmin />} /> 
                </Route>

                {/* Khu vực của Editor (Sửa lỗi Route review) */}
                <Route element={<PrivateRoute allowedRoles={['editor', 'admin']} />}>
                  <Route path="review" element={<ReviewList />} />
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