import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postApi } from '../../api/post.api';
import { interactionApi } from '../../api/interaction.api';

export default function ArticleDetail() {
  const { id } = useParams();
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
        
        setPost(postData);

        // NẾU BÀI ĐÃ XUẤT BẢN THÌ MỚI TẢI COMMENT
        if (postData.status === 'published') {
          try {
            const commentRes = await interactionApi.getCommentsByPost(id);
            setComments(commentRes.data || []);
          } catch (commentErr) {
            console.error("Lỗi tải comment:", commentErr);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Không tìm thấy bài viết hoặc bạn không có quyền truy cập.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải bài viết... ⏳</div>;
  if (error || !post) return <div style={{ padding: '50px', textAlign: 'center', color: 'red', fontWeight: 'bold' }}>{error}</div>;

  // XỬ LÝ STATUS AN TOÀN: Lấy giá trị thật, nếu DB không có thì ngầm định là draft
  const currentStatus = post.status || 'draft';

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      
      {currentStatus !== 'published' && (
        <div style={{ padding: '12px 15px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', marginBottom: '25px', fontWeight: 'bold', border: '1px solid #ffeeba' }}>
          ⚠️ Đây là bản xem trước (Draft/Review). Bài viết này chưa được xuất bản ra công chúng.
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
        
        {/* KIỂM TRA NỘI DUNG: Nếu DB trả về rỗng thì báo đỏ */}
        {post.content ? (
          <div style={{ whiteSpace: 'pre-line' }}>{post.content}</div>
        ) : (
          <div style={{ padding: '20px', border: '1px dashed red', color: 'red', backgroundColor: '#fff5f5', borderRadius: '8px' }}>
             ⚠️ Lỗi: Bài viết này bị trống nội dung (Content) trong Database (có thể do lỗi từ những lần tạo thử trước đó). Vui lòng ra ngoài tạo bài viết mới nhé!
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
      
      <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px dashed #ccc', paddingTop: '20px' }}>
         <button onClick={() => window.history.back()} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
           ⬅ Quay lại
         </button>
      </div>
    </div>
  );
}