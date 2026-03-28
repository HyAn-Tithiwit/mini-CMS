import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postApi } from '../../api/post.api';
import { interactionApi } from '../../api/interaction.api';
import { useAuth } from '../../context/AuthContext';

export default function ArticleDetail() {
  const { id } = useParams(); // Lấy ID bài viết từ URL (ví dụ: /post/123 -> id = 123)
  const navigate = useNavigate();
  const { user } = useAuth(); // Lấy thông tin user hiện tại để check quyền bình luận

  // 1. Quản lý trạng thái
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái khi đang gửi comment

  // 2. Tải dữ liệu bài viết và bình luận khi mở trang
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        
        // Gọi song song 2 API cho lẹ: Lấy bài viết & Lấy bình luận
        const [postRes, commentsRes] = await Promise.all([
          postApi.getDetailPost(id),
          interactionApi.getCommentsInPost(id)
        ]);

        // Gán dữ liệu (tuỳ thuộc cấu trúc backend trả về, ở đây giả sử trả về .data)
        setPost(postRes.data || postRes);
        setComments(commentsRes.data || commentsRes || []);
        
      } catch (err) {
        setError('Không tìm thấy bài viết hoặc có lỗi xảy ra.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]); // Chạy lại nếu ID trên URL thay đổi

  // 3. Xử lý chức năng Lưu bài viết (Bookmark)
  const handleBookmark = async () => {
    if (!user) {
      alert('Bạn cần đăng nhập để lưu bài viết!');
      navigate('/login');
      return;
    }
    
    try {
      await interactionApi.saveBookmark(id);
      alert('Đã lưu bài viết thành công! Bạn có thể xem trong mục Đã lưu.');
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi khi lưu bài viết.');
    }
  };

  // 4. Xử lý chức năng Gửi bình luận
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Bạn cần đăng nhập để bình luận!');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return; // Không cho gửi bình luận trống

    try {
      setIsSubmitting(true);
      
      // Giả sử API yêu cầu gửi postId và content
      await interactionApi.createComment({ 
        postId: id, 
        content: newComment 
      });

      // Gửi xong thì xóa khung nhập
      setNewComment('');
      
      // Lấy lại danh sách bình luận mới nhất để hiển thị
      const updatedComments = await interactionApi.getCommentsInPost(id);
      setComments(updatedComments.data || updatedComments || []);
      
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể gửi bình luận lúc này.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Giao diện khi đang tải hoặc lỗi
  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải nội dung... ⏳</div>;
  if (error || !post) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;

  // 6. Giao diện chính
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      {/* Nút quay lại */}
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#007BFF' }}>
        ← Quay lại trang chủ
      </Link>

      {/* --- PHẦN BÀI VIẾT --- */}
      <article style={{ borderBottom: '2px solid #eee', paddingBottom: '30px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '15px' }}>{post.title}</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#666', marginBottom: '20px' }}>
          <div>
            <span>✍️ Tác giả: <strong>{post.author?.username || 'Ẩn danh'}</strong></span>
            {/* Nếu backend có trả về createdAt thì format ngày tháng ở đây */}
          </div>
          
          <button 
            onClick={handleBookmark}
            style={{ padding: '8px 15px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
          >
            🔖 Lưu bài viết
          </button>
        </div>

        {post.thumbnail && (
          <img src={post.thumbnail} alt={post.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} />
        )}

        {/* Nội dung bài viết */}
        <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#333', whiteSpace: 'pre-wrap' }}>
          {/* Lưu ý: Nếu post.content là mã HTML từ Rich Text Editor, bạn phải dùng dangerouslySetInnerHTML */}
          {post.content}
        </div>
      </article>

      {/* --- PHẦN BÌNH LUẬN --- */}
      <section>
        <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>💬 Bình luận ({comments.length})</h3>
        
        {/* Form nhập bình luận */}
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          {!user ? (
            <p style={{ margin: 0 }}>
              Vui lòng <Link to="/login" style={{ color: '#007BFF' }}>Đăng nhập</Link> để tham gia bình luận.
            </p>
          ) : (
            <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <textarea 
                rows="3"
                placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
                required
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !newComment.trim()}
                style={{ alignSelf: 'flex-end', padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
              </button>
            </form>
          )}
        </div>

        {/* Danh sách bình luận */}
        <div>
          {comments.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          ) : (
            comments.map((cmt) => (
              <div key={cmt._id} style={{ padding: '15px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  👤 {cmt.user?.username || 'Người dùng ẩn danh'}
                </div>
                <div style={{ color: '#333' }}>
                  {cmt.content}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}