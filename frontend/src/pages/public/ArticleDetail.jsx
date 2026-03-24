// File: src/pages/public/ArticleDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Link2, Bookmark, MessageCircle, TrendingUp, Share2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function ArticleDetail() {
  const { id } = useParams(); // Lấy ID bài viết từ URL
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiError, setIsApiError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi vào bài viết mới
    
    // Viết hàm gọi API riêng biệt bằng async/await cho chuẩn
    const fetchArticle = async () => {
      // Báo ESLint bỏ qua lỗi này vì chúng ta CẦN render lại để hiện chữ "Đang tải..."
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      
      try {
        const res = await axiosClient.get(`/posts/${id}`);
        const data = res.data?.data || res.data;
        
        if (data) {
          setArticle(data);
          setIsApiError(false);
        } else {
          setIsApiError(true);
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết bài viết:", err);
        setIsApiError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Đang tải bài viết...</div>;
  }

  return (
    <main className="max-w-[1400px] mx-auto px-6">
      
      {/* 1. THANH ĐIỀU HƯỚNG BREADCRUMB */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/category/${article?.category?.slug || 'technology'}`} className="hover:text-foreground transition-colors capitalize">
          {article?.category?.name || 'Category'}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground truncate max-w-[200px]">{article?.title || 'Article'}</span>
      </nav>

      {/* 2. CẤU TRÚC 2 CỘT (70% NỘI DUNG - 30% SIDEBAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-12 pb-16">
        
        {/* CỘT TRÁI: NỘI DUNG BÀI VIẾT CHÍNH */}
        <div>
          {isApiError || !article ? (
            /* ===== GIAO DIỆN TĨNH KHI API LỖI (MOCK DATA TỪ FIGMA) ===== */
            <article>
              <h1 className="mb-6 font-serif text-[48px] leading-[1.1] tracking-tight">
                The Future of Artificial Intelligence: How Machine Learning Is Reshaping Our World
              </h1>
              <div className="flex items-center gap-4 pb-6 mb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">JD</span>
                  </div>
                  <div>
                    <div className="font-medium">Jessica Davis</div>
                    <div className="text-sm text-muted-foreground">March 18, 2026</div>
                  </div>
                </div>
              </div>
              <p className="mb-8 text-lg leading-relaxed font-semibold">
                As artificial intelligence continues to advance at an unprecedented pace, industry leaders and researchers are grappling with both the extraordinary potential and the profound challenges that these technologies present for society.
              </p>
              <figure className="mb-8">
                <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop" alt="AI Technology" className="w-full h-auto rounded-sm" />
                <figcaption className="mt-3 text-sm text-muted-foreground">Advanced neural networks are transforming how we interact with technology. Photo: Unsplash</figcaption>
              </figure>
              <div className="prose max-w-none text-lg">
                <p className="mb-6 leading-relaxed">The landscape of artificial intelligence has transformed dramatically over the past decade. What once seemed like science fiction has become an integral part of our daily lives...</p>
                <p className="mb-6 leading-relaxed">According to recent research from leading technology institutes, AI systems are now capable of performing tasks that were considered impossible just five years ago.</p>
              </div>
            </article>
          ) : (
            /* ===== GIAO DIỆN THẬT TỪ DATABASE ===== */
            <article>
              <h1 className="mb-6 font-serif text-[48px] leading-[1.1] tracking-tight">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 pb-6 mb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <span className="text-sm font-medium uppercase">
                      {article.author?.name ? article.author.name.charAt(0) : 'A'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{article.author?.name || 'Admin'}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
              <p className="mb-8 text-lg leading-relaxed font-semibold">
                {article.excerpt}
              </p>
              {article.coverImage && (
                <figure className="mb-8">
                  <img src={article.coverImage} alt={article.title} className="w-full h-auto rounded-sm object-cover max-h-[600px]" />
                </figure>
              )}
              {/* Render HTML Content an toàn trả về từ Backend */}
              <div 
                className="prose prose-lg max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-500"
                dangerouslySetInnerHTML={{ __html: article.content }} 
              />
            </article>
          )}

          {/* NÚT CHIA SẺ (SOCIAL SHARE) */}
          <div className="py-8 border-y border-border my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Share this article:</span>
                <div className="flex gap-2">
                <button className="p-2 hover:bg-accent rounded-full transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-accent rounded-full transition-colors">
                  <Link2 className="w-5 h-5" />
                </button>
              </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-lg transition-colors">
                <Bookmark className="w-5 h-5" />
                <span className="text-sm">Save</span>
              </button>
            </div>
          </div>

          {/* KHU VỰC BÌNH LUẬN (COMMENT SECTION) */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6" />
              <h2 className="text-2xl font-serif">Comments (3)</h2>
            </div>
            <div className="mb-8">
              <textarea placeholder="Join the discussion..." className="w-full p-4 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring" rows="4"></textarea>
              <div className="flex justify-end mt-3">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Post Comment</button>
              </div>
            </div>
            {/* Mock Comment List */}
            <div className="space-y-6">
              {[
                { name: 'Michael Roberts', text: 'Excellent article! The ethical considerations around AI are often overlooked.' },
                { name: 'Emma Thompson', text: 'The comparison to the Industrial Revolution is apt. We must learn from history.' }
              ].map((cmt, idx) => (
                <div key={idx} className="pb-6 border-b border-border last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium">{cmt.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{cmt.name}</span>
                        <span className="text-sm text-muted-foreground">·</span>
                        <span className="text-sm text-muted-foreground">Just now</span>
                      </div>
                      <p className="mb-3 leading-relaxed">{cmt.text}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="hover:text-foreground transition-colors">Reply</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: SIDEBAR */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <aside className="space-y-8">
            {/* Trending News */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-lg font-serif">Trending News</h3>
              </div>
              <div className="space-y-4">
                {[
                  { img: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&fit=crop", cat: "World", title: "Global Climate Summit Reaches Historic Agreement on Emissions" },
                  { img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&fit=crop", cat: "Business", title: "Tech Giants Announce Major Investment in Renewable Energy" }
                ].map((item, idx) => (
                  <Link key={idx} to="#" className="flex gap-3 group hover:opacity-80 transition-opacity">
                    <img src={item.img} alt="" className="w-20 h-20 object-cover rounded flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{item.cat}</div>
                      <h4 className="text-sm leading-tight line-clamp-3">{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Banner Quảng Cáo */}
            <div className="bg-muted rounded-lg p-8 text-center">
              <div className="text-muted-foreground text-sm">Advertisement</div>
              <div className="mt-4 h-64 flex items-center justify-center border-2 border-dashed border-border rounded">
                <span className="text-muted-foreground">300 x 250</span>
              </div>
            </div>

            {/* Bài viết liên quan */}
            <div>
              <h3 className="text-lg mb-4 pb-3 border-b border-border font-serif">Related Articles</h3>
              <ul className="space-y-3">
                <li><Link to="#" className="text-sm hover:opacity-70 transition-opacity leading-relaxed block">How AI Is Transforming Healthcare Diagnostics</Link></li>
                <li><Link to="#" className="text-sm hover:opacity-70 transition-opacity leading-relaxed block">The Ethics of Algorithmic Decision-Making</Link></li>
                <li><Link to="#" className="text-sm hover:opacity-70 transition-opacity leading-relaxed block">Understanding Machine Learning: A Beginner's Guide</Link></li>
              </ul>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}