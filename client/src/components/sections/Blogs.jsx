import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

const Blogs = ({ blogs = [] }) => {
  // Safe defaults if database has no entries
  const defaultBlogs = [
    {
      _id: '1',
      title: 'Building a Retrieval-Augmented Generation (RAG) Chatbot',
      slug: 'building-rag-chatbot',
      category: 'AI',
      createdAt: new Date('2024-03-10'),
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      description: 'Step-by-step breakdown on configuring LangChain, Ollama, and vector search on Node.js backends for localized context lookup.',
    },
    {
      _id: '2',
      title: 'Competitive Programming: Transitioning from CodeChef to LeetCode',
      slug: 'cp-transition-codechef-leetcode',
      category: 'DSA',
      createdAt: new Date('2024-01-15'),
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
      description: 'Understanding time complexity constraints, memory limits, and optimization rules for cracking tech interviews.',
    },
  ];

  const blogRecords = blogs.length > 0 ? blogs.slice(0, 3) : defaultBlogs;

  return (
    <section id="blogs" className="py-24 bg-[#05050b] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Articles & Notes</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Recent <span className="gradient-text text-glow">Blogs</span>
          </h2>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mt-4" />
        </div>

        {/* Blogs cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {blogRecords.map((item, idx) => {
            const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group rounded-3xl glass-card border border-white/5 hover:border-white/15 overflow-hidden flex flex-col h-full hover:shadow-glow transition-all duration-300 clickable"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bgDark/90 via-bgDark/20 to-transparent" />
                </div>

                {/* Card details */}
                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {dateStr}
                    </span>
                    <span className="uppercase tracking-widest text-[9px] font-bold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 border border-indigo-500/10 rounded">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-md sm:text-lg font-display font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.description || item.content?.substring(0, 120) + '...'}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/5 flex">
                    <Link
                      to={`/blogs/${item.slug}`}
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold group-hover:gap-2 transition-all"
                    >
                      <span>Read Full Post</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Blogs;
