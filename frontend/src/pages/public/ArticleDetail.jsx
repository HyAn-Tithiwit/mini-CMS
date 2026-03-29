import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postApi } from '../../api/post.api';
import { interactionApi } from '../../api/interaction.api';
import { useAuth } from '../../context/AuthContext';
import CommentSection from '../../components/CommentSection';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- STATE CHO BOOKMARK ---
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        // 1. Lấy chi tiết bài viết
        const postRes = await postApi.getDetailPost(id);
        const postData = postRes.data || postRes;

        // Xử lý gán nội dung hiển thị
        postData.content = postData.content_html || postData.content_markdown || postData.content;

        if (!postData.content) {
          try {
            const listRes = await postApi.getPosts({ limit: 100 });
            const allPosts = listRes.data || [];
            const fullPost = allPosts.find(p => p._id === id);
            if (fullPost) {
              postData.content = fullPost.content_html || fullPost.content_markdown || fullPost.content;
            }
          } catch (e) { console.error("Lỗi lấy content dự phòng:", e); }
        }

        postData.status = postData.status || 'draft';
        setPost(postData);

        // 2. KIỂM TRA TRẠNG THÁI BOOKMARK (Dựa trên Backend mới)
        if (user) {
          try {
            const bookmarkRes = await interactionApi.getBookmarks();
            const list = bookmarkRes.data || [];
            
            /** * Vì Backend đã populate 'post', nên b.post sẽ là một Object.
             * Chúng ta cần so sánh b.post._id với id từ URL.
             */
            const found = list.find(b => {
                const bookmarkedPostId = b.post?._id || b.post; // Phòng trường hợp BE không populate
                return bookmarkedPostId === id;
            });

            if (found) {
              setIsBookmarked(true);
              setBookmarkId(found._id); // Lưu bookmarkId để xóa sau này
            } else {
              setIsBookmarked(false);
              setBookmarkId(null);
            }
          } catch (err) { 
            console.error("Lỗi kiểm tra bookmark:", err); 
          }
        }
      } catch (err) {
        setError('Không tìm thấy bài viết hoặc bạn không có quyền truy cập.');
        console.error("Lỗi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id, user]);

  const handleBookmarkToggle = async () => {
    if (!user) return alert("Vui lòng đăng nhập để lưu bài viết!");
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        // Nếu đã lưu -> Thực hiện Xóa bằng bookmarkId
        await interactionApi.removeBookmark(bookmarkId);
        setIsBookmarked(false);
        setBookmarkId(null);
      } else {
        // Nếu chưa lưu -> Thực hiện Thêm mới
        const res = await interactionApi.addBookmark(id);
        const newBookmark = res.data || res;
        setIsBookmarked(true);
        setBookmarkId(newBookmark._id);
      }
    } catch (err) {
      alert("Thao tác bookmark thất bại!");
      console.error("Lỗi bookmark:", err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải bài viết... ⏳</div>;
  if (error || !post) return <div style={{ padding: '50px', textAlign: 'center', color: 'red', fontWeight: 'bold' }}>{error}</div>;

  const currentStatus = post.status;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', padding: '8px 15px', backgroundColor: '#e9ecef', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
        ⬅ Quay lại
      </button>

      <h1 style={{ fontSize: '32px', marginBottom: '15px', color: '#333', lineHeight: '1.4' }}>{post.title}</h1>
      
      <div style={{ color: '#666', fontSize: '15px', marginBottom: '25px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span>👤 Tác giả: <strong>{post.author || 'Ẩn danh'}</strong></span>
        <span>📁 Danh mục: <strong>{post.category?.name || 'Chưa phân loại'}</strong></span>
        <span style={{ padding: '4px 8px', backgroundColor: '#e9ecef', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{currentStatus.toUpperCase()}</span>
        
        {currentStatus === 'published' && (
          <button 
            onClick={handleBookmarkToggle} 
            disabled={bookmarkLoading} 
            style={{ 
              marginLeft: 'auto', 
              padding: '6px 18px', 
              borderRadius: '20px', 
              border: '1px solid #007bff', 
              backgroundColor: isBookmarked ? '#007bff' : 'transparent', 
              color: isBookmarked ? '#fff' : '#007bff', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            {bookmarkLoading ? '...' : isBookmarked ? '🔖 Đã lưu' : '🔖 Lưu bài viết'}
          </button>
        )}
      </div>

      {post.image && <img src={post.image} alt={post.title} style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', borderRadius: '8px', marginBottom: '30px' }} />}

      <div style={{ fontSize: '17px', lineHeight: '1.8', color: '#444', marginBottom: '40px' }}>
        <p style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '25px', fontSize: '18px' }}>{post.summary}</p>
        <div style={{ overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {currentStatus === 'published' && (
        <div style={{ borderTop: '2px solid #eee', paddingTop: '30px' }}>
          <CommentSection postId={id} />
        </div>
      )}
    </div>
  );
}