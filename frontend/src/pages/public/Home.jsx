import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postApi } from '../../api/post.api';

export default function Home() {
  // 1. Quản lý các trạng thái của trang
  const [posts, setPosts] = useState([]); // Lưu danh sách bài viết
  const [loading, setLoading] = useState(true); // Trạng thái đang tải dữ liệu
  const [error, setError] = useState(''); // Lưu thông báo lỗi nếu có

  // 2. Tự động gọi API lấy bài viết ngay khi trang vừa load xong
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Gọi API lấy danh sách bài viết từ file post.api.js
        const response = await postApi.getPosts(); 
        
        // LƯU Ý: Tuỳ thuộc vào backend của bạn trả về cấu trúc thế nào.
        // Ví dụ: response.data, response.posts, hoặc trả thẳng mảng response
        // Ở đây mình giả sử backend trả về một mảng chứa các bài viết
        const postList = response.data || response.posts || response || []; 
        setPosts(postList);
        
      } catch (err) {
        setError('Không thể tải danh sách bài viết. Vui lòng thử lại sau!');
        console.error("Lỗi lấy bài viết:", err);
      } finally {
        setLoading(false); // Dù lỗi hay thành công cũng phải tắt trạng thái loading
      }
    };

    fetchPosts();
  }, []); // Mảng rỗng [] nghĩa là chỉ chạy 1 lần duy nhất khi mở trang

  // 3. Giao diện hiển thị khi đang tải hoặc bị lỗi
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' }}>
        Đang tải các bài viết mới nhất... ⏳
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h3>Oops!</h3>
        <p>{error}</p>
      </div>
    );
  }

  // 4. Giao diện chính: Hiển thị danh sách bài viết
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Banner / Tiêu đề trang */}
      <div style={{ textAlign: 'center', padding: '40px 0', borderBottom: '2px solid #eee', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', color: '#333', marginBottom: '10px' }}>📰 Tin Tức & Blog Mới Nhất</h1>
        <p style={{ color: '#666', fontSize: '18px' }}>Cập nhật những thông tin và góc nhìn thú vị mỗi ngày</p>
      </div>

      {/* Danh sách bài viết */}
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888' }}>
          Chưa có bài viết nào được đăng tải.
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {posts.map((post) => (
            <div key={post._id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Giả sử bài viết có ảnh thumbnail, nếu không có thì bỏ qua phần img này */}
              {post.thumbnail && (
                <img 
                  src={post.thumbnail} 
                  alt={post.title} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px' }}
                />
              )}
              
              <h3 style={{ fontSize: '20px', margin: '0 0 10px 0', color: '#007BFF' }}>
                <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {post.title}
                </Link>
              </h3>
              
              {/* Hiển thị một đoạn ngắn của nội dung (excerpt) */}
              <p style={{ color: '#555', flexGrow: 1, lineHeight: '1.5' }}>
                {post.summary || (post.content ? post.content.substring(0, 100) + '...' : 'Đang cập nhật nội dung...')}
              </p>
              
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#888' }}>
                <span>✍️ {post.author?.username || 'Ẩn danh'}</span>
                
                {/* Nút Đọc tiếp */}
                <Link 
                  to={`/post/${post._id}`} 
                  style={{ 
                    padding: '8px 12px', 
                    backgroundColor: '#007BFF', 
                    color: '#fff', 
                    textDecoration: 'none', 
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}
                >
                  Đọc tiếp →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}