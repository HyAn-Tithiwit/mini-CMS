import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, Eye } from 'lucide-react';
import axiosClient from '../../../api/axiosClient';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axiosClient.get('/posts'); // Backend sẽ tự lọc theo ID người đăng nhập
        setPosts(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMyPosts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-bold">Quản lý bài viết</h2>
        <Link to="/dashboard/posts/create" className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90">
          <Plus className="w-5 h-5" /> Viết bài mới
        </Link>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-medium text-sm">Tiêu đề</th>
              <th className="p-4 font-medium text-sm">Danh mục</th>
              <th className="p-4 font-medium text-sm">Trạng thái</th>
              <th className="p-4 font-medium text-sm">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 max-w-xs truncate font-medium">{post.title}</td>
                <td className="p-4 text-sm capitalize">{post.category?.name || 'Uncategorized'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                    post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <Link to={`/article/${post._id}`} className="p-2 hover:bg-muted rounded text-muted-foreground" title="Xem bài viết"><Eye className="w-4 h-4"/></Link>
                  <button className="p-2 hover:bg-blue-50 rounded text-blue-600" title="Chỉnh sửa"><Edit3 className="w-4 h-4"/></button>
                  <button className="p-2 hover:bg-red-50 rounded text-red-600" title="Xóa"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}