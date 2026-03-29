import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postApi } from '../../../api/post.api';

export default function ReviewList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviewPosts = async () => {
    try {
      setLoading(true);
      // Gọi thẳng API Editor, không check điều kiện Frontend lằng nhằng nữa
      const res = await postApi.getEditorPosts(); 
      // Ép kiểu dữ liệu để chắc chắn lấy được mảng Array
      let postsArray = [];
      if (Array.isArray(res?.data)) {
        postsArray = res.data;
      } else if (res?.data && Array.isArray(res.data.data)) {
        postsArray = res.data.data;
      } else if (Array.isArray(res)) {
        postsArray = res;
      }

      setPosts(postsArray);
    } catch (error) {
      console.error("Lỗi API Duyệt Bài:", error);
      // BẬT CÒI BÁO ĐỘNG BẰNG ALERT
      alert("FRONTEND KHÔNG GỌI ĐƯỢC API! Lỗi: " + error.message); 
    } finally {
      setLoading(false);
    }
  };

  // 🛡️ CHẠY NGAY LẬP TỨC: Bỏ [] dependency để chắc chắn 100% gọi API khi load
  useEffect(() => {
    fetchReviewPosts();
  }, []);

  const handleApprove = async (id) => {
    if(!window.confirm('Xác nhận Duyệt xuất bản bài viết này?')) return;
    try {
      await postApi.approvePost(id); 
      alert('Đã duyệt xuất bản thành công!');
      fetchReviewPosts(); 
    } catch(err) { alert('Lỗi khi duyệt!'); console.error(err);}
  };

  const handleReject = async (id) => {
    if(!window.confirm('Từ chối và trả lại bài viết này cho Tác giả?')) return;
    try {
      await postApi.rejectPost(id); 
      alert('Đã từ chối bài viết!');
      fetchReviewPosts();
    } catch(err) { alert('Lỗi khi từ chối!'); console.error(err);}
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderTop: '4px solid #ffc107' }}>
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h2 style={{ margin: 0, color: '#856404' }}>🛡️ Khu Vực Kiểm Duyệt Bài Viết</h2>
        <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0 0' }}>Danh sách các bài viết do Tác giả gửi lên đang chờ phê duyệt.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px', fontWeight: 'bold' }}>Đang kết nối Backend lấy dữ liệu... ⏳</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px' }}>Tiêu đề</th>
                <th style={{ padding: '12px' }}>Tác giả</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#28a745', fontWeight: 'bold' }}>🎉 Không có bài viết nào đang chờ duyệt.</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', maxWidth: '300px', fontWeight: 'bold' }}>{post.title}</td>
                    <td style={{ padding: '12px' }}>{post.author?.username || 'Ẩn danh'}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <Link to={`/post/${post._id}`} style={{ padding: '6px 10px', backgroundColor: '#17a2b8', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>Xem</Link>
                        <button onClick={() => handleApprove(post._id)} style={{ padding: '6px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>✅ Duyệt</button>
                        <button onClick={() => handleReject(post._id)} style={{ padding: '6px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>❌ Từ chối</button>
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