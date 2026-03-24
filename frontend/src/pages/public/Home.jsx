import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="max-w-[1400px] mx-auto px-6 py-8">
      {/* 1. KHU VỰC BÀI VIẾT NỔI BẬT */}
      <section className="mb-12 pb-12 border-b border-border">
        <Link className="group" to="/article/1">
          <div className="mb-6 aspect-[2/1] bg-gray-200 rounded overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop" 
              alt="AI Future" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          <div className="max-w-3xl">
            <span className="text-sm uppercase tracking-wider text-blue-600 mb-2 block">Technology</span>
            <h1 className="text-5xl mb-4 group-hover:text-blue-600 transition-colors">
              The Future of Artificial Intelligence: How Machine Learning is Reshaping Our World
            </h1>
            <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
              As AI continues to advance at an unprecedented pace, experts discuss the implications for society, economy, and human creativity in the coming decade.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>By Sarah Chen</span><span>•</span><time>March 18, 2026</time><span>•</span><span>8 min read</span>
            </div>
          </div>
        </Link>
      </section>

      {/* 2. TOP STORIES */}
      <section className="mb-12 pb-12 border-b border-border">
        <h2 className="text-2xl mb-6 font-medium">Top Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { id: 2, title: "Global Climate Summit Reaches Historic Agreement", category: "World", author: "James Wilson" },
            { id: 3, title: "New Quantum Computing Breakthrough Announced", category: "Technology", author: "Dr. Emily Rodriguez" },
            { id: 4, title: "Economic Recovery Shows Strong Momentum", category: "Business", author: "Michael Chang" }
          ].map((item) => (
            <Link key={item.id} className="group" to={`/article/${item.id}`}>
              <div className="mb-4 aspect-[16/10] bg-gray-200 rounded overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop&seed=${item.id}`} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <span className="text-xs uppercase tracking-wider text-blue-600 mb-2 block">{item.category}</span>
              <h3 className="text-xl mb-3 group-hover:text-blue-600 transition-colors leading-snug font-medium">
                {item.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{item.author}</span><span>•</span><time>March 17, 2026</time>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. LATEST NEWS */}
      <section>
        <h2 className="text-2xl mb-6 font-medium">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { id: 5, category: "Science", title: "Advances in Gene Therapy Show Promise for Rare Diseases", author: "Dr. Rachel Kim" },
            { id: 6, category: "Business", title: "The Rise of Remote Work: Five Years Later", author: "Tom Anderson" },
            { id: 7, category: "Culture", title: "Major Archaeological Discovery in Mediterranean", author: "Isabella Martinez" },
            { id: 8, category: "Technology", title: "Electric Vehicle Sales Surge to New Record", author: "Alex Thompson" },
            { id: 9, category: "Health", title: "Mental Health Awareness Campaign Launches Globally", author: "Dr. Maya Patel" },
            { id: 10, category: "Science", title: "Space Tourism Takes Off with New Private Mission", author: "Chris Roberts" }
          ].map((news) => (
            <Link key={news.id} className="group flex gap-4 pb-6 border-b border-border" to={`/article/${news.id}`}>
              <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                <img src={`https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop&seed=${news.id}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
              </div>
              <div className="flex-1">
                <span className="text-xs uppercase tracking-wider text-blue-600 mb-2 block">{news.category}</span>
                <h3 className="text-lg mb-2 group-hover:text-blue-600 transition-colors leading-snug">{news.title}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{news.author}</span><span>•</span><time>March 16, 2026</time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}