import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postApi } from '../../api/post.api';
import { interactionApi } from '../../api/interaction.api';
import { useAuth } from '../../context/AuthContext'; // Thêm quyền để phân biệt Admin

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Dùng navigate để quay lại an toàn
  const { user } = useAuth(); // Lấy thông tin user hiện tại

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        const postRes = await postApi.getDetailPost(id);
        const postData = postRes.data || postRes;

        // Trick bù đắp dữ liệu bị khuyết
        if (!postData.content && !postData.content_markdown) {
          try {
            const listRes = await postApi.getPosts({ limit: 100 });
            const allPosts = listRes.data || [];
            const fullPost = allPosts.find(p => p._id === id);
            if (fullPost) {
              postData.content = fullPost.content_html || fullPost.content_markdown || fullPost.content;
            }
          } catch (e) { console.error(e); }
        }

        postData.status = postData.status || 'draft';
        setPost(postData);

        if (postData.status === 'published') {
          try {
            const commentRes = await interactionApi.getCommentsByPost(id);
            setComments(commentRes.data || []);
          } catch (commentErr) { console.error(commentErr); }
        }
      } catch (err) {
        setError('Không tìm thấy bài viết hoặc bạn không có quyền truy cập.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  // --- HÀM XỬ LÝ DÀNH RIÊNG CHO ADMIN / EDITOR ---
  const handleApprove = async () => {
    if(!window.confirm('Xác nhận Duyệt xuất bản bài viết này?')) return;
    try {
      await postApi.approvePost(id);
      alert('Đã duyệt bài viết thành công!');
      navigate('/dashboard/posts'); // Duyệt xong đá về Dashboard
    } catch(err) { alert('Lỗi khi duyệt!'); console.error(err);}
  };

  const handleReject = async () => {
    if(!window.confirm('Bạn muốn Từ chối/Trả lại bài viết này cho tác giả?')) return;
    try {
      await postApi.rejectPost(id);
      alert('Đã từ chối bài viết!');
      navigate('/dashboard/posts');
    } catch(err) { alert('Lỗi khi từ chối!'); console.error(err);}
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải bài viết... ⏳</div>;
  if (error || !post) return <div style={{ padding: '50px', textAlign: 'center', color: 'red', fontWeight: 'bold' }}>{error}</div>;

  const currentStatus = post.status || 'draft';

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      
      {/* NÚT QUAY LẠI CẬP NHẬT */}
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', padding: '8px 15px', backgroundColor: '#e9ecef', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
        ⬅ Quay lại
      </button>

      {currentStatus !== 'published' && (
        <div style={{ padding: '12px 15px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', marginBottom: '25px', fontWeight: 'bold', border: '1px solid #ffeeba' }}>
          ⚠️ Đây là bản xem trước (Draft/Review). Bài viết này chưa được xuất bản ra công chúng.
        </div>
      )}

      {/* 👑 BẢNG ĐIỀU KHIỂN RIÊNG CHO ADMIN / EDITOR */}
      {user && ['admin', 'editor'].includes(user.role) && currentStatus === 'review' && (
        <div style={{ padding: '20px', backgroundColor: '#e8f4fd', border: '1px dashed #007bff', borderRadius: '8px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', color: '#0056b3' }}>🛡️ Khu vực kiểm duyệt</h3>
            <span style={{ fontSize: '14px', color: '#333' }}>Bạn có quyền xuất bản hoặc trả lại bài viết này.</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
             <button onClick={handleApprove} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>✅ Duyệt Publish</button>
             <button onClick={handleReject} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>❌ Trả lại bài</button>
          </div>
        </div>
      )}

      <h1 style={{ fontSize: '32px', marginBottom: '15px', color: '#333', lineHeight: '1.4' }}>{post.title}</h1>
      
      <div style={{ color: '#666', fontSize: '15px', marginBottom: '25px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <span>👤 Tác giả: <strong>{post.author?.username || 'Ẩn danh'}</strong></span>
        <span>📁 Danh mục: <strong>{post.category?.name || 'Chưa phân loại'}</strong></span>
        <span style={{ padding: '4px 8px', backgroundColor: '#e9ecef', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{currentStatus.toUpperCase()}</span>
      </div>

      {post.image && (
        <img src={post.image} alt={post.title} style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', borderRadius: '8px', marginBottom: '30px' }} />
      )}

      <div style={{ fontSize: '17px', lineHeight: '1.8', color: '#444', marginBottom: '40px' }}>
        <p style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '25px', fontSize: '18px' }}>{post.summary}</p>
        
        {post.content ? (
          <div style={{ overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <div style={{ padding: '20px', border: '1px dashed red', color: 'red', backgroundColor: '#fff5f5', borderRadius: '8px' }}>
             ⚠️ Lỗi: Không thể tải nội dung (Dù đã dùng Frontend trick).
          </div>
        )}
      </div>

      {currentStatus === 'published' && (
        <div style={{ borderTop: '2px solid #eee', paddingTop: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>💬 Bình luận ({comments.length})</h3>
          {comments.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          ) : (
            comments.map(c => (
              <div key={c._id} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
                <strong style={{ color: '#007bff' }}>{c.user?.username || 'Người dùng ẩn danh'}</strong>
                <p style={{ margin: '8px 0 0 0', color: '#333' }}>{c.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}