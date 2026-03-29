import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { postApi } from '../../../api/post.api';
import { taxonomyApi } from '../../../api/taxonomy.api'; // Lấy API Taxonomy
import { useAuth } from '../../../context/AuthContext';

export default function CreatePost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth(); 

  // 1. Quản lý dữ liệu form (Sửa tags thành mảng rỗng thay vì chuỗi)
  const [formData, setFormData] = useState({
    title: '',
    slug: '', 
    summary: '',
    content: '',
    category: '', 
    tags: [] // Dùng mảng để lưu danh sách ID của các Tag được tick
  });
  
  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(''); 

  // State lưu danh sách Category và Tag lấy từ Backend
  const [categoriesList, setCategoriesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 2. Tải dữ liệu khi vừa vào trang (Bao gồm Categories, Tags và Dữ liệu bài cũ nếu đang sửa)
  useEffect(() => {
    const initData = async () => {
      try {
        // Tải danh sách Danh mục và Thẻ từ Database
        const [catRes, tagRes] = await Promise.all([
          taxonomyApi.getCategories(),
          taxonomyApi.getTags()
        ]);
        
        setCategoriesList(catRes.data || []);
        setTagsList(tagRes.data || []);

        // Nếu đang ở chế độ Sửa, tải thêm dữ liệu bài viết
        if (isEditMode) {
          const response = await postApi.getDetailPost(id);
          const postData = response.data || response;
          
          setFormData({
            title: postData.title || '',
            slug: postData.slug || '',
            summary: postData.summary || '',
            content: postData.content || '',
            category: postData.category || '',
            tags: postData.tags || [] // Backend trả về mảng ID tags
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

  // 3. Xử lý nhập liệu text và select
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 4. Xử lý khi tick/bỏ tick các Thẻ (Tags)
  const handleTagChange = (tagId) => {
    setFormData((prev) => {
      const isSelected = prev.tags.includes(tagId);
      if (isSelected) {
        // Nếu đã tick rồi thì bỏ ra khỏi mảng
        return { ...prev, tags: prev.tags.filter(id => id !== tagId) };
      } else {
        // Nếu chưa tick thì thêm vào mảng
        return { ...prev, tags: [...prev.tags, tagId] };
      }
    });
  };

  // 5. Xử lý ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  // 6. Gửi dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ BƯỚC BẢO VỆ 1: Kiểm tra bắt buộc phải có dữ liệu trước khi gọi API
    if (!formData.title.trim()) return alert("Vui lòng nhập tiêu đề bài viết!");
    if (!formData.content.trim()) return alert("Vui lòng nhập nội dung chi tiết!");
    if (!formData.category) return alert("Vui lòng chọn danh mục (Category)!");

    // 🛡️ BƯỚC BẢO VỆ 2: Đảm bảo lấy được ID của Admin/Author
    const authorId = user?._id || user?.userId || user?.id; 
    if (!authorId) {
        alert("Lỗi: Không tìm thấy ID tác giả. Vui lòng F5 hoặc đăng nhập lại!");
        return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      submitData.append('title', formData.title);
      if(formData.slug) submitData.append('slug', formData.slug);
      submitData.append('summary', formData.summary);
      submitData.append('content', formData.content);
      submitData.append('category', formData.category);
      submitData.append('author', authorId);

      // Gửi mảng tags lên Backend
      if (formData.tags && formData.tags.length > 0) {
        formData.tags.forEach(tagId => submitData.append('tags', tagId));
      }

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
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Tiêu đề <span style={{color: 'red'}}>*</span></label>
            <input 
              type="text" name="title" value={formData.title} onChange={handleChange} required 
              placeholder="Nhập tiêu đề hấp dẫn..."
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Slug (URL thân thiện SEO)</label>
            <input 
              type="text" name="slug" value={formData.slug} onChange={handleChange} 
              placeholder="bai-viet-moi"
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
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

        {/* --- KHU VỰC CHỌN DANH MỤC & THẺ GIAO DIỆN TRỰC QUAN --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Ảnh bìa (Thumbnail)</label>
            <input 
              type="file" accept="image/*" onChange={handleImageChange} 
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', marginBottom: '15px' }}
            />
            {imagePreview && (
              <div style={{ border: '1px solid #eee', padding: '5px', borderRadius: '4px', backgroundColor: '#fff' }}>
                 <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
            )}
          </div>

          <div>
            {/* DROPDOWN CHỌN DANH MỤC */}
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

            {/* CHECKBOX CHỌN NHIỀU THẺ */}
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
            {loading ? 'Đang xử lý...' : isEditMode ? '💾 Cập nhật bài viết' : '🚀 Đăng bài viết'}
          </button>
        </div>

      </form>
    </div>
  );
}