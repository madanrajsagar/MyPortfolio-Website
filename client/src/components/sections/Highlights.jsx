import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, GraduationCap, MapPin, Zap, Code2, Sparkles } from 'lucide-react';

const Highlights = () => {
  const highlights = [
    {
      icon: Trophy,
      title: '1st Runner-Up – HackoutSav',
      subtitle: 'National Hackathon',
      description: 'Secured 2nd place out of 100+ teams across Maharashtra, winning a cash prize of ₹15,000 for building a functional MERN prototype.',
      color: 'text-gray-300',
      bg: 'bg-white/5',
      border: 'border-white/10',
      glow: 'shadow-white/5',
      badge: '₹15,000 Prize',
    },
    {
      icon: Award,
      title: 'Winner – AI Prompt Battle',
      subtitle: 'Prompt Engineering Championship',
      description: 'Won 1st place in the real-time AI prompt battle by crafting highly optimized prompts and few-shot logic for LLMs under constraints.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/10',
      badge: 'Winner',
    },
    {
      icon: Sparkles,
      title: 'Winner – Reimagine',
      subtitle: 'Innovation Challenge',
      description: 'Secured 1st place by architecting and presenting a modern digital replacement for institutional administrative workflows.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/10',
      badge: 'Winner',
    },
    {
      icon: GraduationCap,
      title: 'College Topper (Diploma)',
      subtitle: 'Computer Technology',
      description: 'Graduated at Rank 1 overall with 95.09% aggregate, remaining topper for four consecutive semesters.',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      glow: 'shadow-violet-500/10',
      badge: '95.09% Marks',
    },
    {
      icon: MapPin,
      title: 'Maharashtra State Rank 330',
      subtitle: 'MSBTE Board merit list',
      description: 'Placed in the top percentile among thousands of computer diploma students across the entire state of Maharashtra.',
      color: 'text-rose-400',
      bg: 'bg-rose-500/5',
      border: 'border-rose-500/15',
      glow: 'shadow-rose-500/5',
      badge: 'State Merit',
    },
    {
      icon: Star,
      title: 'Current CGPA – 9.29',
      subtitle: 'B.Tech AI & ML at Walchand',
      description: 'Consistently high academic standing in Artificial Intelligence & Machine Learning specialization subjects.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/10',
      badge: '9.29 CGPA',
    },
    {
      icon: Code2,
      title: 'Built Multiple Full Stack & AI Projects',
      subtitle: 'MERN + Local LLMs',
      description: 'From AI safety portals (Abhaya) to resource catalogs (MSBTE Navigator) and travel platforms (TravelNest).',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      glow: 'shadow-indigo-500/10',
      badge: '4+ Projects',
    },
  ];

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
          {highlights.map((h, idx) => (
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
          ))}
        </div>

      </div>
    </section>
  );
};

export default Highlights;
