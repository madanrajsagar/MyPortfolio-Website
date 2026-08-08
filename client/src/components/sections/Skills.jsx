import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Layout, Server, Brain, Database, Cloud, Wrench, Sparkles, Terminal, GitBranch, BookOpen, Users } from 'lucide-react';

const Skills = ({ skills = [], isLoading = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('Programming Languages');

  const skillRecords = skills;

  const categories = [
    'Programming Languages',
    'Frontend Development',
    'Backend Development',
    'Database Technologies',
    'Artificial Intelligence & Machine Learning',
    'DevOps & Cloud',
    'Tools & Platforms',
    'Data Visualization'
  ];

  const categoryConfig = {
    'Programming Languages': { icon: Code, color: 'text-violet-400', chipClass: 'skill-chip-violet', glowColor: 'violet' },
    'Frontend Development': { icon: Layout, color: 'text-sky-400', chipClass: 'skill-chip-sky', glowColor: 'sky' },
    'Backend Development': { icon: Server, color: 'text-emerald-400', chipClass: 'skill-chip-emerald', glowColor: 'emerald' },
    'Database Technologies': { icon: Database, color: 'text-amber-400', chipClass: 'skill-chip-amber', glowColor: 'amber' },
    'Artificial Intelligence & Machine Learning': { icon: Brain, color: 'text-pink-400', chipClass: 'skill-chip-pink', glowColor: 'pink' },
    'DevOps & Cloud': { icon: Cloud, color: 'text-indigo-400', chipClass: 'skill-chip', glowColor: 'indigo' },
    'Tools & Platforms': { icon: Wrench, color: 'text-teal-400', chipClass: 'skill-chip-teal', glowColor: 'teal' },
    'Data Visualization': { icon: BookOpen, color: 'text-violet-500', chipClass: 'skill-chip-violet', glowColor: 'violet' },
    All: { icon: Sparkles, color: 'text-white', chipClass: 'skill-chip', glowColor: 'indigo' },
  };

  const levelConfig = {
    Expert: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
    Advanced: { color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', dot: 'bg-indigo-400' },
    Intermediate: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
    Beginner: { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', dot: 'bg-gray-400' },
  };

  const filteredSkills = selectedCategory === 'All'
    ? skillRecords
    : skillRecords.filter(skill => skill.category === selectedCategory);

  const getCategoryConfig = (cat) => categoryConfig[cat] || categoryConfig.All;

  return (
    <section id="skills" className="py-24 bg-[#05050b] relative overflow-hidden">
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] aurora-blur-2 pointer-events-none rounded-full opacity-60" />
      <div className="absolute bottom-[10%] left-[-5%] w-[250px] h-[250px] aurora-blur-1 pointer-events-none rounded-full opacity-40" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <Brain className="w-3.5 h-3.5 animate-pulse" />
            <span>Technical Arsenal</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Skills & <span className="gradient-text text-glow">Expertise</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full mt-4" />
          <p className="mt-4 text-gray-500 text-sm max-w-lg">
            A curated breakdown of my technical toolkit — from core programming languages to AI/ML frameworks and cloud infrastructure.
          </p>
        </div>

        {/* Infinite Scrolling Tech Marquee */}
        <div className="mb-14 overflow-hidden relative py-3 group">
          <div className="flex gap-4 w-max animate-marquee group-hover:[animation-play-state:paused]">
            {['React.js ⚛️', 'Node.js 🟢', 'Python 🐍', 'MongoDB 🍃', 'LangChain 🔗', 'Ollama (Local LLMs) 🧠', 'Tailwind CSS 🎨', 'TypeScript 🔵', 'Express.js ⚡', 'Docker 🐳', 'REST APIs 🔗', 'Postman 📮', 'AWS Cloud ☁️', 'Java ☕'].concat(['React.js ⚛️', 'Node.js 🟢', 'Python 🐍', 'MongoDB 🍃', 'LangChain 🔗', 'Ollama (Local LLMs) 🧠', 'Tailwind CSS 🎨', 'TypeScript 🔵', 'Express.js ⚡', 'Docker 🐳', 'REST APIs 🔗', 'Postman 📮', 'AWS Cloud ☁️', 'Java ☕']).map((item, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 whitespace-nowrap shadow-sm hover:border-blue-500/40 transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14">
          {categories.map((cat) => {
            const cfg = getCategoryConfig(cat);
            const CatIcon = cfg.icon;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center gap-2 clickable ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-purple-500/30 hover:bg-white/8'
                }`}
              >
                <CatIcon className={`w-3.5 h-3.5 ${selectedCategory === cat ? 'text-white' : cfg.color}`} />
                <span>{cat}</span>
                {selectedCategory !== cat && (
                  <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded-full text-gray-600">
                    {skillRecords.filter(s => cat === 'All' || s.category === cat).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Skills Chips Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="p-4 rounded-2xl glass-card border border-white/5 flex flex-col gap-3 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5" />
                    <div className="flex-1">
                      <div className="h-4 w-3/4 rounded bg-white/5 mb-2" />
                      <div className="h-3 w-1/2 rounded bg-white/5" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                    <div className="h-4 w-16 rounded bg-white/5" />
                    <div className="h-3 w-10 rounded bg-white/5" />
                  </div>
                </div>
              ))
            ) : filteredSkills.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-600">
                <Brain className="w-10 h-10 mx-auto mb-3 opacity-30 animate-bounce" />
                <p className="text-sm">No skills found in this category.</p>
              </div>
            ) : (
              filteredSkills.map((skill, idx) => {
                const cfg = getCategoryConfig(skill.category);
                const lvl = levelConfig[skill.level || 'Intermediate'] || levelConfig.Intermediate;
                const CatIcon = cfg.icon;

                return (
                  <motion.div
                    key={`${skill.name}-${selectedCategory}`}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: idx * 0.02 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`p-4 rounded-2xl glass-card border border-white/5 flex flex-col gap-3 group cursor-default skill-chip ${cfg.chipClass} relative overflow-hidden`}
                  >
                    {/* Glow shimmer on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                    </div>

                    {/* Header: emoji + name + category */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border bg-white/5 border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                        {skill.emoji || skill.name.substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-bold text-white text-sm truncate group-hover:text-indigo-200 transition-colors">
                          {skill.name}
                        </div>
                        <div className={`text-[9px] font-bold uppercase tracking-wider ${cfg.color} flex items-center gap-1 mt-0.5`}>
                          <CatIcon className="w-2.5 h-2.5" />
                          {skill.category}
                        </div>
                      </div>
                    </div>


                    {/* Footer: level + experience */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${lvl.color} ${lvl.bg} ${lvl.border} flex items-center gap-1`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${lvl.dot}`} />
                        {skill.level || 'Intermediate'}
                      </span>
                      <span className="text-[9px] text-gray-600 font-semibold">
                        {skill.experienceYears}y exp
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>


      </div>
    </section>
  );
};

export default Skills;
