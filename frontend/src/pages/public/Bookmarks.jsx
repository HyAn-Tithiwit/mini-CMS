import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { interactionApi } from '../../api/interaction.api';
import { useAuth } from '../../context/AuthContext';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const res = await interactionApi.getBookmarks();
      console.log("Danh sách bookmark:", res.data); // Kiểm tra dữ liệu trả về từ API
      
      // Backend của bạn trả về data là mảng các bookmark
      setBookmarks(res.data || []);
    } catch (err) {
      console.error("Lỗi tải danh sách lưu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (bookmarkId) => {
    if (!window.confirm("Bạn muốn bỏ lưu bài viết này?")) return;
    try {
      await interactionApi.removeBookmark(bookmarkId);
      setBookmarks(bookmarks.filter(b => b._id !== bookmarkId));
    } catch (err) {
      alert("Không thể gỡ bookmark!");
      console.error("Lỗi gỡ bookmark:", err);
    }
  };

  if (!user) return <div style={{ padding: '50px', textAlign: 'center' }}>Vui lòng đăng nhập để xem bài viết đã lưu.</div>;
  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải... ⏳</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        🔖 Bài viết bạn đã lưu
      </h2>

      {bookmarks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <p style={{ color: '#666' }}>Bạn chưa lưu bài viết nào.</p>
          <Link to="/" style={{ color: '#007bff', fontWeight: 'bold' }}>Khám phá bài viết ngay</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {bookmarks.map((item) => (
            <div key={item._id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              {/* Ảnh bài viết */}
              {item.post?.image && (
                <img src={item.post.image} alt={item.post.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              )}
              
              <div style={{ padding: '15px' }}>
                <h3 style={{ fontSize: '18px', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                  {item.post?.title || "Bài viết không còn tồn tại"}
                </h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <Link 
                    to={`/post/${item.post?._id || item.post}`} 
                    style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
                  >
                    Đọc tiếp →
                  </Link>
                  
                  <button 
                    onClick={() => handleRemove(item._id)}
                    style={{ backgroundColor: 'transparent', color: '#dc3545', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                  >
                    🗑️ Gỡ lưu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}