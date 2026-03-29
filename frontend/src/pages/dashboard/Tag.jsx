import React, { useState, useEffect } from 'react';
import { taxonomyApi } from '../../api/taxonomy.api';

export default function Tag() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await taxonomyApi.getTags();
      setTags(res.data || []);
    } catch (error) {
      console.error(error);
      alert('Lỗi lấy danh sách thẻ!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleChange = (e) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  const handleEditClick = (tag) => {
    setEditId(tag._id);
    setFormData({ name: tag.name });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({ name: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) {
        await taxonomyApi.updateTag(editId, formData);
        alert('Cập nhật thành công!');
      } else {
        await taxonomyApi.createTag(formData);
        alert('Thêm mới thành công!');
      }
      handleCancelEdit();
      fetchTags();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá thẻ này?')) return;
    try {
      await taxonomyApi.deleteTag(id);
      fetchTags();
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi xoá!');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>🏷️ Quản lý Thẻ (Tags)</h2>

      <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #ddd' }}>
        <h3 style={{ marginTop: 0, fontSize: '16px' }}>{editId ? 'Sửa Thẻ' : 'Thêm Thẻ Mới'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tên thẻ (*)" required style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', backgroundColor: editId ? '#ffc107' : '#28a745', color: editId ? '#000' : '#fff', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              {isSubmitting ? 'Đang lưu...' : (editId ? 'Lưu thay đổi' : 'Thêm mới')}
            </button>
            {editId && (
              <button type="button" onClick={handleCancelEdit} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Huỷ</button>
            )}
          </div>
        </form>
      </div>

      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f3f5', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Tên Thẻ</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Slug</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd', width: '150px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{tag.name}</td>
                <td style={{ padding: '12px', color: '#666' }}>{tag.slug}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button onClick={() => handleEditClick(tag)} style={{ padding: '6px 10px', marginRight: '5px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sửa</button>
                  <button onClick={() => handleDelete(tag._id)} style={{ padding: '6px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Xoá</button>
                </td>
              </tr>
            ))}
            {tags.length === 0 && (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Chưa có thẻ nào.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}