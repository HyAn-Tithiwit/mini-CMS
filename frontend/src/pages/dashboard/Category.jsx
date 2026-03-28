import React, { useState, useEffect } from 'react';
import { taxonomyApi } from '../../api/taxonomy.api';
import { useAuth } from '../../context/AuthContext';

export default function Category() {
  const { user } = useAuth();
  
  // 1. Quản lý State
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Form tạo mới
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // 2. Hàm gọi API lấy danh sách Danh mục
  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Gọi API (đảm bảo backend đã có API này)
      const response = await taxonomyApi.getCategories();
      
      // Xử lý dữ liệu trả về
      const dataList = response.data || response.categories || response || [];
      setCategories(dataList);
    } catch (error) {
      console.error('Lỗi khi tải danh mục (Có thể backend chưa có API GET):', error);
      // Tạm thời set mảng rỗng nếu lỗi
      setCategories([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 3. Hàm Xử lý Tạo Danh mục mới
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setIsCreating(true);
      // Gọi API create-category
      await taxonomyApi.createCategory({ 
        name: newCategoryName,
        description: newCategoryDesc // Nếu backend cần
      });
      
      alert('Đã tạo danh mục thành công!');
      
      // Reset form
      setNewCategoryName('');
      setNewCategoryDesc('');
      
      // Tải lại danh sách mới nhất
      fetchCategories();

    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi khi tạo danh mục!');
    } finally {
      setIsCreating(false);
    }
  };

  // 4. Hàm Xử lý Xoá Danh mục
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xoá danh mục "${name}" không? Các bài viết thuộc danh mục này có thể bị ảnh hưởng!`)) {
      return;
    }

    try {
      // Gọi API delete-category
      await taxonomyApi.deleteCategory(id);
      alert('Đã xoá danh mục thành công!');
      
      // Cập nhật lại danh sách sau khi xoá
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi khi xoá danh mục!');
    }
  };

  // 5. Kiểm tra quyền hạn (Tránh lọt user lạ vào)
  if (!['admin', 'editor'].includes(user?.role)) {
    return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>Bạn không có quyền truy cập trang này!</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>📁 Quản Lý Danh Mục (Categories)</h2>

      {/* Dùng Grid để chia màn hình làm 2 cột: Cột thêm mới và Cột danh sách */}
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* --- CỘT TRÁI: FORM THÊM MỚI --- */}
        <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            + Thêm Danh Mục Mới
          </h3>
          
          <form onSubmit={handleCreateCategory}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Tên danh mục <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                placeholder="Ví dụ: Công nghệ, Thể thao..."
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Mô tả (Tuỳ chọn)</label>
              <textarea 
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                rows="3"
                placeholder="Nhập mô tả cho danh mục này..."
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={isCreating}
              style={{ width: '100%', padding: '12px', backgroundColor: isCreating ? '#6c757d' : '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: isCreating ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
            >
              {isCreating ? 'Đang tạo...' : 'Lưu Danh Mục'}
            </button>
          </form>
        </div>

        {/* --- CỘT PHẢI: BẢNG DANH SÁCH --- */}
        <div style={{ flex: '2 1 500px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            Danh Sách Hiện Có
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Đang tải dữ liệu... ⏳</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>Tên danh mục</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                        Chưa có danh mục nào hoặc đang chờ API backend.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '12px', color: '#666', fontSize: '13px' }}>{cat._id}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#333' }}>{cat.name}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button 
                            onClick={() => handleDeleteCategory(cat._id, cat.name)}
                            style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                          >
                            Xoá
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}