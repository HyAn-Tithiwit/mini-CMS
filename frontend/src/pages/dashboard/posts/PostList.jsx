import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postApi } from '../../../api/post.api';
import { useAuth } from '../../../context/AuthContext';

export default function PostList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Hàm gọi danh sách bài viết
  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Nếu là Admin/Editor thì gọi API lấy tất cả bài kèm trạng thái duyệt
      // Nếu là Author thì tạm thời gọi API public (hoặc API riêng nếu backend có)
      const response = ['admin', 'editor'].includes(user.role) 
        ? await postApi.getPostsWithReviewStatus()
        : await postApi.getPosts(); // Đáng lý ra backend cần có API "get-my-posts" cho author
      
      const dataList = response.data || response.posts || response || [];
      setPosts(dataList);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user.role]);

  // 2. Hàm xử lý Xoá bài viết
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá bài viết này không? Hành động này không thể hoàn tác!')) return;
    
    try {
      await postApi.deletePost(id);
      alert('Đã xoá bài viết thành công!');
      fetchPosts(); // Cập nhật lại danh sách sau khi xoá
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi khi xoá bài viết');
    }
  };

  // 3. Hàm xử lý Gửi bài đi duyệt (Dành cho Author)
  const handleSubmitReview = async (id) => {
    try {
      await postApi.submitToReview(id);
      alert('Đã gửi bài viết đi chờ duyệt thành công!');
      fetchPosts();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi khi gửi duyệt');
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      
      {/* Tiêu đề & Nút thêm mới */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Danh Sách Bài Viết</h2>
        <button style={{ padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Link 
            to="/dashboard/posts/create" 
            style={{ padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none' }}
          >
            + Viết bài mới
          </Link>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px' }}>Đang tải dữ liệu... ⏳</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px' }}>Tiêu đề</th>
                <th style={{ padding: '12px' }}>Tác giả</th>
                <th style={{ padding: '12px' }}>Trạng thái</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>Chưa có bài viết nào.</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {post.title}
                    </td>
                    <td style={{ padding: '12px' }}>{post.author?.username || 'Ẩn danh'}</td>
                    
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '5px 10px', 
                        borderRadius: '20px', 
                        fontSize: '12px',
                        backgroundColor: post.status === 'published' ? '#d4edda' : post.status === 'review' ? '#fff3cd' : '#f8d7da',
                        color: post.status === 'published' ? '#155724' : post.status === 'review' ? '#856404' : '#721c24'
                      }}>
                        {post.status === 'published' ? 'Đã xuất bản' : post.status === 'review' ? 'Chờ duyệt' : 'Bản nháp/Bị từ chối'}
                      </span>
                    </td>
                    
                    <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      {/* Nút Xem trước */}
                      <Link to={`/post/${post._id}`} target="_blank" style={{ padding: '5px 10px', backgroundColor: '#17a2b8', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '13px' }}>
                        Xem
                      </Link>

                      {/* Nút Xoá */}
                      <button onClick={() => handleDelete(post._id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                        Xoá
                      </button>

                      {/* Nếu là Author và bài chưa gửi duyệt thì hiện nút Gửi duyệt */}
                      {user.role === 'author' && post.status !== 'review' && post.status !== 'published' && (
                        <button onClick={() => handleSubmitReview(post._id)} style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                          Gửi duyệt
                        </button>
                      )}
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