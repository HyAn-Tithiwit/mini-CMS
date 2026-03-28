import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postApi } from '../../api/post.api';

export default function Search() {
  // 1. Quản lý các trạng thái nhập liệu và kết quả
  const [searchType, setSearchType] = useState('keyword'); // Mặc định là tìm theo từ khóa
  const [searchValue, setSearchValue] = useState(''); // Giá trị người dùng gõ vào
  
  const [results, setResults] = useState([]); // Lưu kết quả trả về
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false); // Check xem đã bấm tìm kiếm lần nào chưa

  // 2. Hàm xử lý khi user bấm nút "Tìm kiếm"
  const handleSearch = async (e) => {
    e.preventDefault(); // Chặn hành vi load lại trang của form
    
    if (!searchValue.trim()) {
      alert('Vui lòng nhập nội dung tìm kiếm!');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      let response;

      // Dựa vào loại tìm kiếm mà gọi API tương ứng
      switch (searchType) {
        case 'keyword':
          response = await postApi.searchByKeyword(searchValue);
          break;
        case 'category':
          // LƯU Ý: Chỗ này backend của bạn search bằng ID hay Tên danh mục thì gõ cái đó vào searchValue nhé
          response = await postApi.searchByCategory(searchValue); 
          break;
        case 'tag':
          response = await postApi.searchByTag(searchValue);
          break;
        default:
          throw new Error('Loại tìm kiếm không hợp lệ');
      }

      // Xử lý dữ liệu trả về (Tuỳ thuộc backend trả về { data: [...] } hay mảng trực tiếp [...])
      const dataList = response.data || response.posts || response || [];
      setResults(dataList);

    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', color: '#333' }}>🔍 Khám Phá Bài Viết</h1>
        <p style={{ color: '#666' }}>Tìm kiếm những nội dung bạn quan tâm nhất</p>
      </div>

      {/* --- FORM TÌM KIẾM --- */}
      <form 
        onSubmit={handleSearch} 
        style={{ 
          display: 'flex', 
          gap: '10px', 
          maxWidth: '700px', 
          margin: '0 auto 40px auto',
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        {/* Dropdown chọn loại tìm kiếm */}
        <select 
          value={searchType} 
          onChange={(e) => setSearchType(e.target.value)}
          style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none', cursor: 'pointer', backgroundColor: '#fff' }}
        >
          <option value="keyword">Theo Từ khóa</option>
          <option value="category">Theo Danh mục (ID)</option>
          <option value="tag">Theo Thẻ/Tag (ID)</option>
        </select>

        {/* Ô nhập nội dung */}
        <input 
          type="text" 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={
            searchType === 'keyword' ? "Nhập tên bài, nội dung..." : 
            searchType === 'category' ? "Nhập ID danh mục..." : "Nhập ID thẻ tag..."
          }
          style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
        />

        {/* Nút Submit */}
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
            whiteSpace: 'nowrap'
          }}
        >
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </form>

      {/* --- KẾT QUẢ TÌM KIẾM --- */}
      <div>
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

        {/* Đang load */}
        {loading && <div style={{ textAlign: 'center', color: '#666' }}>Đang quét dữ liệu... ⏳</div>}

        {/* Load xong nhưng không có kết quả */}
        {!loading && hasSearched && results.length === 0 && !error && (
          <div style={{ textAlign: 'center', color: '#888', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            Không tìm thấy bài viết nào phù hợp với yêu cầu của bạn. 🥲
          </div>
        )}

        {/* Load xong và có kết quả */}
        {!loading && results.length > 0 && (
          <>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
              Tìm thấy {results.length} bài viết:
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {results.map((post) => (
                <div key={post._id} style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '20px',
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {post.thumbnail && (
                    <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px' }} />
                  )}
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                    <Link to={`/post/${post._id}`} style={{ color: '#007BFF', textDecoration: 'none' }}>
                      {post.title}
                    </Link>
                  </h4>
                  <p style={{ color: '#555', flexGrow: 1, fontSize: '14px' }}>
                    {post.summary || (post.content ? post.content.substring(0, 80) + '...' : '')}
                  </p>
                  <div style={{ marginTop: '15px', fontSize: '13px', color: '#888' }}>
                    Tác giả: {post.author?.username || 'Ẩn danh'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}