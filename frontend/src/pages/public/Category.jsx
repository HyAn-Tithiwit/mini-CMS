// File: src/pages/public/Category.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

// Cấu hình tiêu đề và mô tả cho từng thể loại
const CATEGORY_INFO = {
  technology: { title: "Technology", desc: "Latest news and insights on innovation, science, and the digital world" },
  world: { title: "World", desc: "Global news, international relations, and major events happening around the globe" },
  politics: { title: "Politics", desc: "In-depth political analysis, elections, and government policies" },
  business: { title: "Business", desc: "Markets, finance, corporate news, and economic trends" },
  science: { title: "Science", desc: "Discoveries, space exploration, and scientific breakthroughs" },
  health: { title: "Health", desc: "Medical research, wellness, and public health news" },
  sports: { title: "Sports", desc: "Scores, highlights, and updates from the world of sports" },
  culture: { title: "Culture", desc: "Arts, entertainment, lifestyle, and societal trends" },
};

export default function Category() {
  const { slug } = useParams(); // Lấy chữ 'technology', 'world'... từ thanh địa chỉ URL
  const currentCategory = CATEGORY_INFO[slug] || { title: slug, desc: `Explore articles about ${slug}` };

  const [articles, setArticles] = useState([]);
  const [isApiError, setIsApiError] = useState(false);

  useEffect(() => {
    // Cuộn lên đầu trang khi chuyển thể loại
    window.scrollTo(0, 0); 
    
    // Gọi API lấy bài viết theo category slug
    axiosClient.get(`/posts?category=${slug}`)
      .then((res) => {
        const posts = res.data?.data || res.data;
        if (posts && posts.length > 0) {
          setArticles(posts);
          setIsApiError(false);
        } else {
          setIsApiError(true);
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy bài viết:", err);
        setIsApiError(true);
      });
  }, [slug]);

  // Tách bài viết đầu tiên làm bài Nổi bật (Featured), phần còn lại làm lưới (Grid)
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-8 min-h-screen">
      
      {/* 1. Header của Thể loại */}
      <div className="mb-8 pb-6 border-b border-border text-center md:text-left">
        <h1 className="text-5xl mb-3 font-serif capitalize">{currentCategory.title}</h1>
        <p className="text-lg text-muted-foreground">{currentCategory.desc}</p>
      </div>

      {isApiError || articles.length === 0 ? (
        /* ================== GIAO DIỆN TĨNH KHI API LỖI ================== */
        <>
          <section className="mb-12 pb-12 border-b border-border">
            <Link className="group" to="/article/1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-[4/3] bg-gray-200 rounded overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop" alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm uppercase tracking-wider text-blue-600 mb-3 block">Featured</span>
                  <h2 className="text-4xl mb-4 group-hover:text-blue-600 transition-colors leading-tight font-serif">
                    The Future of Artificial Intelligence: How Machine Learning is Reshaping Our World
                  </h2>
                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    As AI continues to advance at an unprecedented pace, experts discuss the implications for society, economy, and human creativity in the coming decade.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>By Sarah Chen</span><span>•</span><time>March 18, 2026</time><span>•</span><span>8 min read</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>

          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[2, 3, 4, 5, 6, 7].map((id) => (
                <Link key={id} className="group" to={`/article/${id}`}>
                  <article className="h-full flex flex-col">
                    <div className="mb-4 aspect-[16/10] bg-gray-200 rounded overflow-hidden">
                      <img src={`https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&seed=${id}`} alt="Thumb" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h3 className="text-xl mb-3 group-hover:text-blue-600 transition-colors leading-snug font-medium">
                      Sample Title for {currentCategory.title} Article {id}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
                      This is a short summary of the article to give readers an idea of what to expect before they click.
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Author Name</span><span>•</span><time>March 17, 2026</time>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* ================== GIAO DIỆN THẬT LẤY TỪ API ================== */
        <>
          {featuredArticle && (
            <section className="mb-12 pb-12 border-b border-border">
              <Link className="group" to={`/article/${featuredArticle._id}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="aspect-[4/3] bg-gray-200 rounded overflow-hidden">
                    <img src={featuredArticle.coverImage || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-sm uppercase tracking-wider text-blue-600 mb-3 block">Featured</span>
                    <h2 className="text-4xl mb-4 group-hover:text-blue-600 transition-colors leading-tight font-serif">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                      {featuredArticle.excerpt || "No description available for this article."}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{featuredArticle.author?.name || "Admin"}</span><span>•</span><time>{new Date(featuredArticle.createdAt).toLocaleDateString()}</time>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridArticles.map((article) => (
                <Link key={article._id} className="group" to={`/article/${article._id}`}>
                  <article className="h-full flex flex-col">
                    <div className="mb-4 aspect-[16/10] bg-gray-200 rounded overflow-hidden">
                      <img src={article.coverImage || `https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&seed=${article._id}`} alt="Thumb" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h3 className="text-xl mb-3 group-hover:text-blue-600 transition-colors leading-snug font-medium line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{article.author?.name || "Admin"}</span><span>•</span><time>{new Date(article.createdAt).toLocaleDateString()}</time>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <div className="mt-12 text-center">
        <button className="px-8 py-3 border border-border rounded hover:bg-gray-50 transition-colors font-medium">
          Load More Articles
        </button>
      </div>
    </main>
  );
}