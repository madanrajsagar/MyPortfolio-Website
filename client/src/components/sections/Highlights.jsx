import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, GraduationCap, MapPin, Zap, Code2, Sparkles, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api.js';

const Highlights = () => {
  const { data: highlightsRes, isLoading, error } = useQuery({
    queryKey: ['highlights'],
    queryFn: () => api.get('/highlights'),
  });

  console.log('HIGHLIGHTS RESPONSE:', highlightsRes);
  console.log('HIGHLIGHTS ERROR:', error);

  const rawHighlights = highlightsRes?.data?.data || [];
  console.log('RAW HIGHLIGHTS:', rawHighlights);

  const iconsMap = {
    Trophy,
    Award,
    Sparkles,
    GraduationCap,
    MapPin,
    Star,
    Code2,
    Globe,
  };

  const highlights = rawHighlights.map(h => ({
    icon: iconsMap[h.icon] || Star,
    title: h.title,
    subtitle: h.subtitle || '',
    description: h.description,
    color: h.color || 'text-indigo-400',
    bg: h.bg || 'bg-indigo-500/10',
    border: h.border || 'border-indigo-500/20',
    glow: h.glow || 'shadow-indigo-500/10',
    badge: h.badge || 'Highlight',
  }));

  return (
    <section id="highlights" className="py-20 bg-[#05050b] relative overflow-hidden">
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] aurora-blur-1 pointer-events-none rounded-full opacity-30" />
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] aurora-blur-2 pointer-events-none rounded-full opacity-30" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Key Credentials</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Professional <span className="gradient-text text-glow">Highlights</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full mt-4" />
          <p className="mt-4 text-gray-500 text-sm max-w-lg">
            Quick credentials summarizing my major achievements, leadership honors, and technical capacity.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="p-6 rounded-2xl glass-card border border-white/5 flex flex-col gap-4 animate-pulse h-48 justify-between">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-xl bg-white/5" />
                  <div className="w-16 h-4 rounded bg-white/5" />
                </div>
                <div className="space-y-2">
                  <div className="w-3/4 h-4 rounded bg-white/5" />
                  <div className="w-1/2 h-3 rounded bg-white/5" />
                </div>
                <div className="w-full h-8 rounded bg-white/5" />
              </div>
            ))
          ) : (
            highlights.map((h, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.06 }}
                whileHover={{ y: -6 }}
                className={`p-6 rounded-2xl glass-card border ${h.border} flex flex-col gap-4 hover:shadow-lg ${h.glow} transition-all duration-300 group clickable relative overflow-hidden`}
              >
                {/* Top border neon line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/30 via-transparent to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${h.bg} border ${h.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <h.icon className={`w-5 h-5 ${h.color}`} />
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${h.color} ${h.bg} ${h.border}`}>
                    {h.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-white text-sm group-hover:text-indigo-200 transition-colors leading-tight">
                    {h.title}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-semibold block mt-1 uppercase tracking-wider">
                    {h.subtitle}
                  </span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mt-1">
                  {h.description}
                </p>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default Highlights;
