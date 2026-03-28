import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { postApi } from '../../../api/post.api';
import { useAuth } from '../../../context/AuthContext';

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Nếu URL là /edit/123 thì id = 123. Nếu là /create thì id = undefined
  
  const isEditMode = Boolean(id); // Biến xác định xem đang ở chế độ Sửa hay Tạo mới

  // 1. Quản lý dữ liệu form
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    thumbnail: '',
    categoryId: '', // Nhập ID danh mục
    tags: '' // Nhập ID các thẻ tag, cách nhau bằng dấu phẩy
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode); // Trạng thái tải dữ liệu bài cũ (nếu đang sửa)

  // 2. Nếu ở chế độ Sửa (Edit), tự động tải dữ liệu bài viết cũ đắp vào Form
  useEffect(() => {
    if (isEditMode) {
      const fetchOldPost = async () => {
        try {
          const response = await postApi.getDetailPost(id);
          const postData = response.data || response;
          
          setFormData({
            title: postData.title || '',
            summary: postData.summary || '',
            content: postData.content || '',
            thumbnail: postData.thumbnail || '',
            categoryId: postData.category || '', // Tuỳ backend trả về object hay string ID
            // Chuyển mảng tag thành chuỗi cách nhau dấu phẩy để dễ sửa
            tags: postData.tags ? postData.tags.join(', ') : '' 
          });
        } catch (error) {
            console.error(error);
          alert('Không tìm thấy bài viết để sửa!');
          navigate('/dashboard/posts');
        } finally {
          setFetching(false);
        }
      };
      fetchOldPost();
    }
  }, [id, navigate, isEditMode]);

  // 3. Xử lý khi user gõ phím vào ô nhập liệu
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 4. Xử lý khi bấm nút "Lưu bài viết"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chuẩn bị dữ liệu để gửi lên backend
      // Xử lý biến chuỗi tags "tag1, tag2" thành mảng ['tag1', 'tag2']
      const dataToSubmit = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };

      if (isEditMode) {
        // --- CHẾ ĐỘ SỬA BÀI ---
        await postApi.updatePost(id, dataToSubmit);
        alert('Cập nhật bài viết thành công!');
      } else {
        // --- CHẾ ĐỘ TẠO BÀI MỚI ---
        // Phân biệt API dựa vào quyền của user (theo list API của bạn)
        if (['admin', 'editor'].includes(user.role)) {
          await postApi.createPostByAdmin(dataToSubmit);
        } else {
          await postApi.createPostByAuthor(dataToSubmit); // Tác giả bình thường
        }
        alert('Tạo bài viết thành công!');
      }
      
      // Xong việc thì đẩy về danh sách bài viết
      navigate('/dashboard/posts');
      
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: '30px', textAlign: 'center' }}>Đang tải dữ liệu bài viết cũ... ⏳</div>;

  return (
    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>{isEditMode ? 'Sửa Bài Viết' : '✍️ Tạo Bài Viết Mới'}</h2>
        <Link to="/dashboard/posts" style={{ textDecoration: 'none', color: '#6c757d', fontWeight: 'bold' }}>
          ✕ Huỷ bỏ
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* --- Tiêu đề --- */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Tiêu đề bài viết <span style={{color: 'red'}}>*</span></label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            placeholder="Nhập tiêu đề hấp dẫn..."
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>

        {/* --- Tóm tắt --- */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Đoạn tóm tắt (Summary)</label>
          <textarea 
            name="summary" 
            value={formData.summary} 
            onChange={handleChange} 
            rows="2"
            placeholder="Viết một đoạn ngắn giới thiệu bài viết..."
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>

        {/* --- Nội dung chính --- */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Nội dung chi tiết <span style={{color: 'red'}}>*</span></label>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '-5px', marginBottom: '10px' }}>
            *(Mẹo: Sau này bạn có thể cài thêm thư viện ReactQuill hoặc TinyMCE để soạn thảo văn bản giống Word)*
          </p>
          <textarea 
            name="content" 
            value={formData.content} 
            onChange={handleChange} 
            required 
            rows="12"
            placeholder="Nhập nội dung bài viết của bạn tại đây..."
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical', fontSize: '15px', lineHeight: '1.6', boxSizing: 'border-box' }}
          />
        </div>

        {/* --- Thumbnail & Category & Tags --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Link ảnh bìa (Thumbnail URL)</label>
            <input 
              type="text" 
              name="thumbnail" 
              value={formData.thumbnail} 
              onChange={handleChange} 
              placeholder="https://domain.com/image.jpg"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
            {formData.thumbnail && (
              <img src={formData.thumbnail} alt="Preview" style={{ marginTop: '10px', width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
            )}
          </div>

          <div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>ID Danh mục (Category)</label>
              <input 
                type="text" 
                name="categoryId" 
                value={formData.categoryId} 
                onChange={handleChange} 
                placeholder="Nhập ID danh mục..."
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Các thẻ (Tags)</label>
              <input 
                type="text" 
                name="tags" 
                value={formData.tags} 
                onChange={handleChange} 
                placeholder="tagId1, tagId2, tagId3..."
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '12px', color: '#888' }}>*Cách nhau bằng dấu phẩy</span>
            </div>
          </div>

        </div>

        {/* --- NÚT SUBMIT --- */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'right' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: loading ? '#6c757d' : '#007BFF', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            {loading ? 'Đang lưu...' : isEditMode ? '💾 Cập nhật bài viết' : '🚀 Đăng bài viết'}
          </button>
        </div>

      </form>
    </div>
  );
}