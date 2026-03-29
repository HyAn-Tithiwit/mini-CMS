import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postApi } from '../../../api/post.api'; // Lưu ý: 3 dấu chấm (../../../)
import { useAuth } from '../../../context/AuthContext';

export default function PostList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Hàm gọi danh sách bài viết
  const fetchPosts = async () => {
    try {
      setLoading(true);
      let res;
      if (user.role === 'editor') {
        res = await postApi.getEditorPosts();
      } else {
        res = await postApi.getPosts(); 
      }
      setPosts(res.data || []);
    } catch (error) {
      console.error(error);
      alert('Lỗi khi lấy danh sách bài viết!');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchPosts();
  }, [user.role]);

  // 2. Hàm xử lý Xoá bài viết (Admin, Author)
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá bài viết này không?')) return;
    try {
      await postApi.deletePost(id);
      alert('Đã xoá bài viết thành công!');
      fetchPosts(); 
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi khi xoá bài viết');
    }
  };

  // 3. Hàm xử lý Gửi bài đi duyệt (Author)
  const handleSubmitReview = async (id) => {
    try {
      await postApi.submitToReview(id);
      alert('Đã gửi bài viết đi chờ duyệt thành công!');
      fetchPosts();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi khi gửi duyệt');
    }
  };

  // 4. Hàm xử lý Duyệt bài (Editor, Admin)
  const handleApprove = async (id) => {
    if(!window.confirm('Xác nhận Duyệt xuất bản bài viết này?')) return;
    try {
      await postApi.approvePost(id);
      alert('Đã duyệt bài viết thành công!');
      fetchPosts();
    } catch(err) { alert('Lỗi khi duyệt!'); console.error(err);}
  };

  // 5. Hàm xử lý Từ chối bài (Editor, Admin)
  const handleReject = async (id) => {
    if(!window.confirm('Bạn muốn Từ chối bài viết này?')) return;
    try {
      await postApi.rejectPost(id);
      alert('Đã từ chối bài viết!');
      fetchPosts();
    } catch(err) { alert('Lỗi khi từ chối!'); console.error(err);}
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      
      {/* Tiêu đề & Nút thêm mới */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>
          {user.role === 'editor' ? '🛡️ Danh sách chờ duyệt' : '📝 Quản lý bài viết'}
        </h2>
        {/* Nút Tạo bài mới chỉ dành cho Author và Admin */}
        {['author', 'admin'].includes(user.role) && (
          <Link to="/dashboard/posts/create" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none' }}>
            + Viết bài mới
          </Link>
        )}
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
                    <td style={{ padding: '12px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'bold' }}>
                      {post.title}
                    </td>
                    <td style={{ padding: '12px' }}>{post.author?.username || 'Ẩn danh'}</td>
                    
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '5px 10px', 
                        borderRadius: '20px', 
                        fontSize: '12px',
                        backgroundColor: post.status === 'published' ? '#d4edda' : post.status === 'review' ? '#fff3cd' : '#e2e3e5',
                        color: post.status === 'published' ? '#155724' : post.status === 'review' ? '#856404' : '#383d41',
                        fontWeight: 'bold'
                      }}>
                        {post.status === 'published' ? 'Đã xuất bản' : post.status === 'review' ? 'Chờ duyệt' : 'Bản nháp'}
                      </span>
                    </td>
                    
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        
                        {/* 1. Nút Xem trước (Ai cũng thấy) */}
                        <Link to={`/post/${post._id}`} target="_blank" style={{ padding: '6px 10px', backgroundColor: '#17a2b8', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>
                          Xem
                        </Link>

                        {/* 2. Các nút duyệt bài (Chỉ EDITOR/ADMIN thấy khi bài đang chờ duyệt) */}
                        {['editor', 'admin'].includes(user.role) && post.status === 'review' && (
                          <>
                            <button onClick={() => handleApprove(post._id)} style={{ padding: '6px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Duyệt</button>
                            <button onClick={() => handleReject(post._id)} style={{ padding: '6px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Từ chối</button>
                          </>
                        )}

                        {/* 3. Nút Gửi duyệt (Chỉ AUTHOR thấy khi bài đang là nháp) */}
                        {user.role === 'author' && post.status === 'draft' && (
                          <button onClick={() => handleSubmitReview(post._id)} style={{ padding: '6px 10px', backgroundColor: '#ffc107', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                            Gửi duyệt
                          </button>
                        )}

                        {/* 4. Nút Sửa & Xoá (Chỉ ADMIN/AUTHOR thấy) */}
                        {['admin', 'author'].includes(user.role) && (
                          <>
                            <Link to={`/dashboard/posts/edit/${post._id}`} style={{ padding: '6px 10px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>Sửa</Link>
                            <button onClick={() => handleDelete(post._id)} style={{ padding: '6px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Xoá</button>
                          </>
                        )}
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