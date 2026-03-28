import React, { useState, useEffect } from 'react';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';

export default function UserManagement() {
  const { user } = useAuth();
  
  // 1. Quản lý State
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Hàm gọi API lấy danh sách toàn bộ người dùng
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authApi.getAllUsers();
      
      // Xử lý dữ liệu trả về (tuỳ thuộc cấu trúc backend của bạn)
      const dataList = response.data || response.users || response || [];
      setUsersList(dataList);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
      alert('Không thể tải danh sách người dùng. Vui lòng kiểm tra lại quyền Admin!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 3. Hàm xử lý Cập nhật trạng thái (Khoá / Mở khoá tài khoản)
  // Backend API: PATCH update-status-byID
  const handleToggleStatus = async (id, currentStatus, username) => {
    // Giả sử backend dùng 'active' và 'banned' (hoặc 'inactive')
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    const actionText = newStatus === 'banned' ? 'Khoá' : 'Mở khoá';
    
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản của "${username}" không?`)) {
      return;
    }

    try {
      // Gọi API cập nhật trạng thái
      await authApi.updateUserStatus(id, { status: newStatus });
      alert(`Đã ${actionText} tài khoản thành công!`);
      
      // Tải lại danh sách để giao diện cập nhật trạng thái mới nhất
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || `Có lỗi khi ${actionText} tài khoản!`);
    }
  };

  // 4. Hàm xử lý Xoá tài khoản vĩnh viễn
  // Backend API: DEL delete-user-by
  const handleDeleteUser = async (id, username, role) => {
    if (role === 'admin') {
      alert('Không thể xoá tài khoản Admin khác để đảm bảo an toàn hệ thống!');
      return;
    }

    if (!window.confirm(`CẢNH BÁO: Bạn có chắc chắn muốn xoá vĩnh viễn tài khoản "${username}" không? Hành động này sẽ xoá toàn bộ dữ liệu liên quan và không thể hoàn tác!`)) {
      return;
    }

    try {
      await authApi.deleteUser(id);
      alert('Đã xoá tài khoản thành công!');
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi khi xoá tài khoản!');
    }
  };

  // 5. Bảo vệ an ninh cấp cao (Chỉ Admin mới được vào trang này)
  if (user?.role !== 'admin') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2 style={{ color: '#dc3545' }}>⛔ Truy cập bị từ chối</h2>
        <p>Chỉ có Quản trị viên (Admin) mới có quyền truy cập vào khu vực này.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>👥 Quản Lý Người Dùng</h2>
        <span style={{ padding: '8px 15px', backgroundColor: '#e9ecef', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          Tổng số: {usersList.length} user
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Đang tải danh sách người dùng... ⏳</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', width: '25%' }}>Người dùng (Email)</th>
                <th style={{ padding: '12px', width: '15%' }}>Vai trò (Role)</th>
                <th style={{ padding: '12px', width: '15%' }}>Trạng thái</th>
                <th style={{ padding: '12px', textAlign: 'center', width: '30%' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {usersList.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#6c757d' }}>
                    Không có dữ liệu người dùng.
                  </td>
                </tr>
              ) : (
                usersList.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    
                    {/* Cột Tên & Email */}
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>{item.username || 'Chưa cập nhật tên'}</div>
                      <div style={{ fontSize: '13px', color: '#666' }}>{item.email}</div>
                    </td>

                    {/* Cột Role (Đổi màu tuỳ theo role cho trực quan) */}
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        backgroundColor: 
                          item.role === 'admin' ? '#f8d7da' : 
                          item.role === 'editor' ? '#cce5ff' :
                          item.role === 'author' ? '#d4edda' : '#e2e3e5',
                        color: 
                          item.role === 'admin' ? '#721c24' : 
                          item.role === 'editor' ? '#004085' :
                          item.role === 'author' ? '#155724' : '#383d41'
                      }}>
                        {item.role || 'reader'}
                      </span>
                    </td>

                    {/* Cột Trạng thái */}
                    <td style={{ padding: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: item.status === 'banned' ? '#dc3545' : '#28a745' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.status === 'banned' ? '#dc3545' : '#28a745' }}></span>
                        {item.status === 'banned' ? 'Đã bị khoá' : 'Đang hoạt động'}
                      </span>
                    </td>

                    {/* Cột Thao tác */}
                    <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      
                      {/* Nút Khoá/Mở khoá */}
                      <button 
                        onClick={() => handleToggleStatus(item._id, item.status || 'active', item.username)}
                        disabled={item.role === 'admin'} // Tránh Admin lỡ tay khoá Admin
                        style={{ 
                          padding: '6px 12px', 
                          backgroundColor: item.status === 'banned' ? '#28a745' : '#ffc107', 
                          color: item.status === 'banned' ? '#fff' : '#333', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: item.role === 'admin' ? 'not-allowed' : 'pointer', 
                          fontSize: '13px',
                          opacity: item.role === 'admin' ? 0.5 : 1
                        }}
                      >
                        {item.status === 'banned' ? '🔓 Mở khoá' : '🔒 Khoá tài khoản'}
                      </button>

                      {/* Nút Xoá */}
                      <button 
                        onClick={() => handleDeleteUser(item._id, item.username, item.role)}
                        disabled={item.role === 'admin'} // Tuyệt đối không cho xoá Admin
                        style={{ 
                          padding: '6px 12px', 
                          backgroundColor: '#dc3545', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: item.role === 'admin' ? 'not-allowed' : 'pointer', 
                          fontSize: '13px',
                          opacity: item.role === 'admin' ? 0.5 : 1
                        }}
                      >
                        🗑️ Xoá
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
  );
}