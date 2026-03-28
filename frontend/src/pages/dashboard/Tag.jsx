import React, { useState, useEffect } from 'react';
import { taxonomyApi } from '../../api/taxonomy.api';
import { useAuth } from '../../context/AuthContext';

export default function Tag() {
  const { user } = useAuth();
  
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await taxonomyApi.getTags();
      const dataList = response.data || response.tags || response || [];
      setTags(dataList);
    } catch (error) {
      console.error('Lỗi khi tải danh sách Thẻ:', error);
      setTags([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      setIsCreating(true);
      await taxonomyApi.createTag({ name: newTagName });
      alert('Đã tạo thẻ (tag) thành công!');
      setNewTagName('');
      fetchTags();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi khi tạo thẻ!');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTag = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xoá thẻ "${name}" không?`)) return;
    try {
      await taxonomyApi.deleteTag(id);
      alert('Đã xoá thẻ thành công!');
      fetchTags();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi khi xoá thẻ!');
    }
  };

  if (!['admin', 'editor'].includes(user?.role)) {
    return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>Bạn không có quyền truy cập trang này!</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>🏷️ Quản Lý Thẻ (Tags)</h2>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* FORM THÊM MỚI */}
        <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            + Thêm Thẻ Mới
          </h3>
          <form onSubmit={handleCreateTag}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Tên thẻ <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                required
                placeholder="Ví dụ: ReactJS, Lập trình..."
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={isCreating}
              style={{ width: '100%', padding: '12px', backgroundColor: isCreating ? '#6c757d' : '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: isCreating ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
            >
              {isCreating ? 'Đang tạo...' : 'Lưu Thẻ'}
            </button>
          </form>
        </div>

        {/* BẢNG DANH SÁCH */}
        <div style={{ flex: '2 1 500px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            Danh Sách Thẻ Hiện Có
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Đang tải dữ liệu... ⏳</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>Tên thẻ</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>Chưa có thẻ nào.</td>
                    </tr>
                  ) : (
                    tags.map((tag) => (
                      <tr key={tag._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '12px', color: '#666', fontSize: '13px' }}>{tag._id}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#333' }}>
                          <span style={{ backgroundColor: '#e9ecef', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>#{tag.name}</span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button 
                            onClick={() => handleDeleteTag(tag._id, tag.name)}
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