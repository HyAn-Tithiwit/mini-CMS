import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postApi } from '../../api/post.api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublishedPosts = async () => {
      try {
        setLoading(true);
        const res = await postApi.getPosts();
        const allPosts = res.data || [];

        // 🛡️ FRONTEND FILTER: Chặn đứng bản nháp, chỉ cho phép bài 'published' lên trang chủ
        const publishedPosts = allPosts.filter(post => post.status === 'published');
        
        setPosts(publishedPosts);
      } catch (error) {
        console.error('Lỗi lấy danh sách trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedPosts();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', color: '#333', marginBottom: '10px' }}>📰 Tin tức & Bài viết mới nhất</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Cập nhật những thông tin và kiến thức bổ ích mỗi ngày.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải bài viết... ⏳</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {posts.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#888' }}>Hiện chưa có bài viết nào được xuất bản.</p>
          ) : (
            posts.map(post => (
              <div key={post._id} style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'transform 0.3s' }}>
                {/* Ảnh bìa */}
                <div style={{ height: '200px', backgroundColor: '#e9ecef' }}>
                  {post.image ? (
                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa' }}>Không có ảnh</div>
                  )}
                </div>
                
                {/* Nội dung Card */}
                <div style={{ padding: '20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#007bff', textTransform: 'uppercase' }}>
                    {post.category?.name || 'Tin tức'}
                  </span>
                  <h3 style={{ margin: '10px 0', fontSize: '20px', lineHeight: '1.4' }}>
                    <Link to={`/post/${post._id}`} style={{ color: '#333', textDecoration: 'none' }}>{post.title}</Link>
                  </h3>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.summary}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <span style={{ fontSize: '13px', color: '#888', fontWeight: 'bold' }}>✍️ {post.author?.username || 'Ẩn danh'}</span>
                    <Link to={`/post/${post._id}`} style={{ fontSize: '13px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Đọc tiếp ➜</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}