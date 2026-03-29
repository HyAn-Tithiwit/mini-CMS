import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postApi } from '../../../api/post.api';
import { useAuth } from '../../../context/AuthContext';

export default function PostList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); 

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let res;
      
      // 🛡️ BẢO MẬT: Nếu là Author, truyền ID vào API để chỉ lấy bài của chính mình!
      if (user.role === 'author') {
        const authorId = user._id || user.userId || user.id;
        res = await postApi.getPosts({ author: authorId });
      } else if (user.role === 'admin') {
        // Admin lấy toàn bộ
        res = await postApi.getPosts(); 
      } else {
        // Editor không dùng trang này nữa
        return;
      }

      let allPosts = res.data || [];
      if (statusFilter !== 'all') {
        allPosts = allPosts.filter(p => p.status === statusFilter);
      }
      setPosts(allPosts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (['admin', 'author'].includes(user?.role)) {
      fetchPosts();
    }
  }, [user.role, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá bài viết này?')) return;
    try {
      await postApi.deletePost(id);
      alert('Đã xoá bài viết!');
      fetchPosts(); 
    } catch (error) { alert('Lỗi khi xoá!'); console.error(error); }
  };

  const handleSubmitReview = async (id) => {
    try {
      await postApi.submitToReview(id);
      alert('Đã gửi chờ duyệt!');
      fetchPosts();
    } catch (error) { alert('Lỗi gửi duyệt'); console.error(error);}
  };

  if (user?.role === 'editor') {
    return <div style={{ padding: '30px', textAlign: 'center' }}>Vui lòng truy cập "Khu vực duyệt bài" trên thanh menu.</div>;
  }

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>📝 {user.role === 'author' ? 'Bài viết của tôi' : 'Kho bài viết tổng'}</h2>
        <Link to="/dashboard/posts/create" style={{ padding: '10px 15px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', textDecoration: 'none' }}>+ Viết bài mới</Link>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #e9ecef', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <label style={{ fontWeight: 'bold', color: '#495057' }}>🔍 Lọc trạng thái:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontWeight: 'bold' }}>
          <option value="all">📁 Tất cả</option>
          <option value="draft">📝 Bản nháp</option>
          <option value="review">⏳ Đang chờ duyệt</option>
          <option value="published">✅ Đã xuất bản</option>
        </select>
      </div>

      {loading ? ( <div style={{ textAlign: 'center', padding: '30px' }}>Đang tải... ⏳</div> ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px' }}>Tiêu đề</th>
                {user.role === 'admin' && <th style={{ padding: '12px' }}>Tác giả</th>}
                <th style={{ padding: '12px' }}>Trạng thái</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>Không có bài viết nào.</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', maxWidth: '300px', fontWeight: 'bold' }}>{post.title}</td>
                    {user.role === 'admin' && <td style={{ padding: '12px' }}>{post.author?.username || 'Ẩn danh'}</td>}
                    
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '12px', backgroundColor: post.status === 'published' ? '#d4edda' : post.status === 'review' ? '#fff3cd' : '#e2e3e5', color: post.status === 'published' ? '#155724' : post.status === 'review' ? '#856404' : '#383d41', fontWeight: 'bold' }}>
                        {post.status === 'published' ? 'Đã xuất bản' : post.status === 'review' ? 'Chờ duyệt' : 'Bản nháp'}
                      </span>
                    </td>
                    
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <Link to={`/post/${post._id}`} style={{ padding: '6px 10px', backgroundColor: '#17a2b8', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>Xem</Link>

                        {user.role === 'author' && post.status === 'draft' && (
                          <button onClick={() => handleSubmitReview(post._id)} style={{ padding: '6px 10px', backgroundColor: '#ffc107', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Gửi duyệt</button>
                        )}

                        <Link to={`/dashboard/posts/edit/${post._id}`} style={{ padding: '6px 10px', backgroundColor: '#6c757d', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>Sửa</Link>
                        <button onClick={() => handleDelete(post._id)} style={{ padding: '6px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Xoá</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}