import React, { useState, useEffect } from 'react';
import { taxonomyApi } from '../../api/taxonomy.api';

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Form (Thêm/Sửa)
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null); // Nếu null là đang Thêm mới, có ID là đang Sửa
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy danh sách Categories khi vào trang
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await taxonomyApi.getCategories();
      setCategories(res.data || []); // Dữ liệu của bạn nằm trong res.data
    } catch (error) {
      console.error(error);
      alert('Lỗi lấy danh sách danh mục!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Xử lý nhập liệu form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Bấm nút Edit trên bảng
  const handleEditClick = (cat) => {
    setEditId(cat._id);
    setFormData({ name: cat.name, description: cat.description || '' });
  };

  // Huỷ bỏ Edit
  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({ name: '', description: '' });
  };

  // Submit Form (Thêm hoặc Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) {
        await taxonomyApi.updateCategory(editId, formData);
        alert('Cập nhật thành công!');
      } else {
        await taxonomyApi.createCategory(formData);
        alert('Thêm mới thành công!');
      }
      handleCancelEdit(); // Reset form
      fetchCategories(); // Load lại bảng
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xoá Category
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá danh mục này?')) return;
    try {
      await taxonomyApi.deleteCategory(id);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi xoá!');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>📁 Quản lý Danh mục (Categories)</h2>

      {/* FORM THÊM / SỬA */}
      <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #ddd' }}>
        <h3 style={{ marginTop: 0, fontSize: '16px' }}>{editId ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tên danh mục (*)" required style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Mô tả..." style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', backgroundColor: editId ? '#ffc107' : '#28a745', color: editId ? '#000' : '#fff', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              {isSubmitting ? 'Đang lưu...' : (editId ? 'Lưu thay đổi' : 'Thêm mới')}
            </button>
            {editId && (
              <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Huỷ bỏ</button>
            )}
          </div>
        </form>
      </div>

      {/* BẢNG HIỂN THỊ */}
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f3f5', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Tên Danh Mục</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Slug</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Mô tả</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd', width: '150px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{cat.name}</td>
                <td style={{ padding: '12px', color: '#666' }}>{cat.slug}</td>
                <td style={{ padding: '12px' }}>{cat.description}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button onClick={() => handleEditClick(cat)} style={{ padding: '6px 10px', marginRight: '5px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sửa</button>
                  <button onClick={() => handleDelete(cat._id)} style={{ padding: '6px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Xoá</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Chưa có danh mục nào.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}