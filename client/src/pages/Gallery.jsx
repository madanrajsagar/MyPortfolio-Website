import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Image as ImageIcon, Video, X, Eye, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);

  // Fetch gallery items
  const { data: galleryRes, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => api.get('/gallery'),
  });

  // Fallbacks if database is empty
  const defaultItems = [
    {
      _id: '1',
      title: 'Hosting Web Dev Workshop - GDG Walchand',
      category: 'gdg',
      mediaUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      date: new Date('2023-10-05'),
    },
    {
      _id: '2',
      title: 'Prompt Battle Winner Ceremony',
      category: 'competitions',
      mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      date: new Date('2023-11-15'),
    },
    {
      _id: '3',
      title: 'Hackathon Hackers - Building in 24 Hours',
      category: 'hackathons',
      mediaUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      date: new Date('2024-02-10'),
    },
    {
      _id: '4',
      title: 'GDG Team Walchand Chapter Group Photo',
      category: 'gdg',
      mediaUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      date: new Date('2023-09-10'),
    },
  ];

  const items = galleryRes?.data?.data?.length > 0 ? galleryRes.data.data : defaultItems;

  const categories = ['All', 'hackathons', 'college', 'events', 'gdg', 'competitions'];

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(i => i.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 mb-10 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-2.5 justify-center sm:justify-start">
          <ImageIcon className="w-8 h-8 text-indigo-400" />
          <span>Life & Event Gallery</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Photographic records from hackathons, GDG Walchand coordination workshops, competitive coding events, and campus life.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-10 justify-center sm:justify-start border-b border-white/5 pb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 uppercase tracking-wide clickable ${
              activeCategory === cat
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-500">Loading gallery data...</div>
      ) : filteredItems.length === 0 ? (
        <div className="py-12 text-center text-xs text-gray-500">No media items found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              onClick={() => setLightboxItem(item)}
              className="group aspect-square rounded-2xl overflow-hidden glass-card border border-white/5 hover:border-indigo-500/20 relative cursor-pointer hover:shadow-glow transition-all duration-300"
            >
              {/* Media indicator */}
              <span className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-bgDark/60 backdrop-blur text-white">
                {item.mediaType === 'video' ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
              </span>

              <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              
              {/* Info overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-bgDark/95 via-bgDark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-400">
                  {item.category}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold text-white mt-1 leading-snug truncate">
                  {item.title}
                </h4>
                <span className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bgDark/95 backdrop-blur"
          onClick={() => setLightboxItem(null)}
        >
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-4xl max-h-[85vh] flex flex-col gap-4 items-center" onClick={e => e.stopPropagation()}>
            <div className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-w-full">
              {lightboxItem.mediaType === 'video' ? (
                <video src={lightboxItem.mediaUrl} controls autoPlay className="max-h-[70vh] object-contain rounded-2xl" />
              ) : (
                <img src={lightboxItem.mediaUrl} alt={lightboxItem.title} className="max-h-[70vh] object-contain rounded-2xl" />
              )}
            </div>

            <div className="text-center flex flex-col gap-1 px-4">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                {lightboxItem.category}
              </span>
              <h3 className="text-sm sm:text-base font-semibold text-white">
                {lightboxItem.title}
              </h3>
              <span className="text-xs text-gray-500">
                {new Date(lightboxItem.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
