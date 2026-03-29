import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { postApi } from '../../../api/post.api';
import { taxonomyApi } from '../../../api/taxonomy.api'; 
import { useAuth } from '../../../context/AuthContext';

export default function CreatePost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth(); 

  // 1. Đã gỡ bỏ trường "slug" khỏi formData
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '', 
    author: '',
    tags: []
  });
  
  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(''); 

  const [categoriesList, setCategoriesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          taxonomyApi.getCategories(),
          taxonomyApi.getTags()
        ]);
        
        setCategoriesList(catRes.data || []);
        setTagsList(tagRes.data || []);

        if (isEditMode) {
          const response = await postApi.getDetailPost(id);
          const postData = response.data || response;
          
          let markdownContent = postData.content_markdown || postData.content;
          if (!markdownContent) {
            try {
              const listRes = await postApi.getPosts({ limit: 100 });
              const allPosts = listRes.data || [];
              const fullPost = allPosts.find(p => p._id === id);
              if (fullPost) {
                markdownContent = fullPost.content_markdown || fullPost.content_html || fullPost.content;
              }
            } catch (e) {
              console.error("Không mót được dữ liệu", e);
            }
          }

          setFormData({
            title: postData.title || '',
            summary: postData.summary || '',
            content: markdownContent || '', 
            category: postData.category?._id || postData.category || '',
            author: postData.author || '',
            tags: postData.tags?.map(t => t._id || t) || [] 
          });
          setImagePreview(postData.image || postData.thumbnail || '');
        }
      } catch (error) {
        console.error(error);
        alert('Có lỗi khi tải dữ liệu. Vui lòng thử lại!');
      } finally {
        setFetching(false);
      }
    };

    initData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagChange = (tagId) => {
    setFormData((prev) => {
      const isSelected = prev.tags.includes(tagId);
      if (isSelected) {
        return { ...prev, tags: prev.tags.filter(id => id !== tagId) };
      } else {
        return { ...prev, tags: [...prev.tags, tagId] };
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return alert("Vui lòng nhập tiêu đề bài viết!");
    if (!formData.author.trim()) return alert("Vui lòng nhập tên tác giả!");
    if (!formData.content.trim()) return alert("Vui lòng nhập nội dung chi tiết!");
    if (!formData.category) return alert("Vui lòng chọn danh mục (Category)!");

    const authorId = user?._id || user?.userId || user?.id; 
    if (!authorId) {
        alert("Lỗi: Không tìm thấy ID tác giả. Vui lòng F5 hoặc đăng nhập lại!");
        return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      submitData.append('title', formData.title);
      submitData.append('author', formData.author);
      submitData.append('summary', formData.summary);
      submitData.append('content', formData.content);
      submitData.append('category', formData.category);
      submitData.append('author', authorId);

      if (formData.tags && formData.tags.length > 0) {
        formData.tags.forEach(tagId => submitData.append('tags', tagId));
      }

      // ⚠️ GHI CHÚ QUAN TRỌNG VỀ UPLOAD ẢNH:
      // Frontend đang gửi file ảnh dưới tên biến là 'image'
      // Nếu Backend của bạn khai báo multer là upload.single('file') hoặc upload.single('thumbnail')
      // thì bạn PHẢI sửa chữ 'image' màu đỏ bên dưới thành 'file' hoặc 'thumbnail' cho khớp nhé.
      if (imageFile) {
        submitData.append('image', imageFile); 
      }

      if (isEditMode) {
        await postApi.updatePost(id, submitData);
        alert('Cập nhật bài viết thành công!');
      } else {
        await postApi.createPostByAuthor(submitData); 
        alert('Tạo bài viết thành công!');
      }
      
      navigate('/dashboard/posts');
      
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: '30px', textAlign: 'center' }}>Đang khởi tạo giao diện... ⏳</div>;

  return (
    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '900px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>{isEditMode ? 'Sửa Bài Viết' : '✍️ Tạo Bài Viết Mới'}</h2>
        <Link to="/dashboard/posts" style={{ textDecoration: 'none', color: '#6c757d', fontWeight: 'bold' }}>
          ✕ Huỷ bỏ
        </Link>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        
        {/* Đã gỡ bỏ ô Slug, mở rộng ô Tiêu đề ra 100% */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Tiêu đề <span style={{color: 'red'}}>*</span></label>
          <input 
            type="text" name="title" value={formData.title} onChange={handleChange} required 
            placeholder="Nhập tiêu đề hấp dẫn..."
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
            Tên tác giả <span style={{color: 'red'}}>*</span>
          </label>
          <input 
            type="text" 
            name="author" 
            value={formData.author} 
            onChange={handleChange} 
            required 
            placeholder="Nhập tên người viết..."
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Đoạn tóm tắt (Summary)</label>
          <textarea 
            name="summary" value={formData.summary} onChange={handleChange} rows="2"
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Nội dung chi tiết (Hỗ trợ Markdown) <span style={{color: 'red'}}>*</span></label>
          <textarea 
            name="content" value={formData.content} onChange={handleChange} required rows="12"
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'monospace' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Ảnh bìa (Thumbnail)</label>
            <input 
              type="file" accept="image/*" name="image" onChange={handleImageChange} 
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', marginBottom: '15px' }}
            />
            {imagePreview && (
              <div style={{ border: '1px solid #eee', padding: '5px', borderRadius: '4px', backgroundColor: '#fff' }}>
                 <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
            )}
          </div>

          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Danh mục (Category) <span style={{color: 'red'}}>*</span></label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                <option value="" disabled>-- Vui lòng chọn danh mục --</option>
                {categoriesList.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Thẻ (Tags)</label>
              <div style={{ padding: '15px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                {tagsList.length === 0 ? (
                  <span style={{color: '#888', fontSize: '14px'}}>Chưa có thẻ nào trong hệ thống.</span>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {tagsList.map(tag => (
                      <label key={tag._id} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', padding: '4px 8px', backgroundColor: '#f1f3f5', borderRadius: '4px', fontSize: '14px' }}>
                        <input 
                          type="checkbox" 
                          checked={formData.tags.includes(tag._id)} 
                          onChange={() => handleTagChange(tag._id)}
                          style={{ cursor: 'pointer' }}
                        />
                        {tag.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>*Bạn có thể chọn nhiều thẻ cùng lúc.</p>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'right' }}>
          <button 
            type="submit" disabled={loading}
            style={{ padding: '12px 24px', backgroundColor: loading ? '#6c757d' : '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            {loading ? 'Đang xử lý...' : isEditMode ? '💾 Cập nhật bài viết' : '💾 Lưu bài (Bản nháp)'}
          </button>
        </div>

      </form>
    </div>
  );
}