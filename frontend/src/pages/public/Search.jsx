import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Calendar, User } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setIsLoading(true);
      try {
        const res = await axiosClient.get(`/posts?keyword=${query}`);
        setResults(res.data.data || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-12 min-h-screen">
      <div className="flex items-center gap-4 mb-10 border-b pb-6">
        <SearchIcon className="w-8 h-8 text-muted-foreground" />
        <h1 className="text-4xl font-serif">Kết quả cho: "{query}"</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-20">Đang tìm kiếm bài viết...</div>
      ) : results.length > 0 ? (
        <div className="grid gap-10">
          {results.map((post) => (
            <article key={post._id} className="group flex flex-col md:flex-row gap-6">
              {post.coverImage && (
                <img src={post.coverImage} className="w-full md:w-64 h-44 object-cover rounded-lg" alt={post.title} />
              )}
              <div className="flex-1">
                <Link to={`/article/${post._id}`} className="text-2xl font-bold group-hover:text-primary transition-colors block mb-2">
                  {post.title}
                </Link>
                <p className="text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                   <span className="flex items-center gap-1"><User className="w-4 h-4"/> {post.author?.name}</span>
                   <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground italic">Không tìm thấy bài viết nào phù hợp với từ khóa của bạn.</div>
      )}
    </div>
  );
}