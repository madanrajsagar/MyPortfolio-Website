import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Sparkles, Trophy, Users, Globe, Code2, Megaphone, Star } from 'lucide-react';

import * as LucideIcons from 'lucide-react';

const Experience = ({ experiences = [], isLoading = false }) => {
  const experienceRecords = experiences.map(exp => {
    // Map highlights stored as "iconName|text"
    const parsedHighlights = (exp.highlights || []).map(hl => {
      const parts = hl.split('|');
      const iconName = parts[0];
      const text = parts[1] || '';
      // Dynamically resolve lucide icon or fallback to Star
      const IconComp = LucideIcons[iconName] || LucideIcons.Star;
      return { icon: IconComp, text };
    });

    return {
      ...exp,
      highlights: parsedHighlights
    };
  });

  const colorConfig = {
    indigo: { border: 'border-indigo-500/40', bg: 'bg-indigo-500/10', text: 'text-indigo-400', badge: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' },
    violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400', badge: 'bg-violet-500/10 border-violet-500/20 text-violet-300' },
    emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' },
  };

  return (
    <section id="experience" className="py-24 bg-[#05050b] relative overflow-hidden">
      <div className="absolute top-[20%] right-[-5%] w-[300px] h-[300px] aurora-blur-2 pointer-events-none rounded-full opacity-40" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Community & Leadership</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Leadership & <span className="gradient-text text-glow">Experience</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-amber-500 rounded-full mt-4" />
          <p className="mt-4 text-gray-500 text-sm max-w-lg">
            Beyond code — leadership roles that demonstrate community impact, organizational skills, and technical mentorship.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Left border line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500/80 via-blue-500/50 to-amber-500/20 origin-top"
          />

          <div className="flex flex-col gap-10 pl-16">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="relative animate-pulse">
                  <div className="absolute -left-[52px] top-5 w-12 h-12 rounded-xl bg-[#0b0b18] border-2 border-white/5" />
                  <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
                    <div className="h-4 w-1/4 rounded bg-white/5" />
                    <div className="h-6 w-1/2 rounded bg-white/5" />
                    <div className="h-4 w-1/3 rounded bg-white/5" />
                    <div className="h-4 w-full rounded bg-white/5 mt-3" />
                    <div className="h-4 w-5/6 rounded bg-white/5" />
                  </div>
                </div>
              ))
            ) : experienceRecords.length === 0 ? (
              <div className="text-center py-10 text-gray-600">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No work/volunteer experience found.</p>
              </div>
            ) : (
              experienceRecords.map((exp, idx) => {
                const startStr = new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
                const endStr = exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '';
                const cfg = colorConfig[exp.color || 'indigo'] || colorConfig.indigo;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
                    whileHover={{ x: 6 }}
                    className="relative"
                  >
                    {/* Node */}
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.15 + 0.1 }}
                      className={`absolute -left-[52px] top-5 w-12 h-12 rounded-xl bg-[#0b0b18] border-2 ${cfg.border} flex items-center justify-center ${cfg.text} shadow-lg z-10`}
                    >
                      <Briefcase className="w-5 h-5" />
                    </motion.div>
                    {/* Current indicator */}
                    {exp.isCurrent && (
                      <div className="absolute -left-[56px] top-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center z-20">
                        <span className="w-2 h-2 bg-emerald-300 rounded-full animate-ping absolute" />
                      </div>
                    )}

                    <div className={`glass-card p-6 sm:p-8 rounded-3xl border border-white/5 hover:${cfg.border} hover:shadow-glow transition-all duration-300 group`}>

                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cfg.badge}`}>
                            {exp.type}
                          </span>
                          {exp.isCurrent && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                              Active
                            </span>
                          )}
                        </div>
                        <h3 className={`text-lg sm:text-xl font-display font-bold text-white group-hover:${cfg.text} transition-colors leading-tight`}>
                          {exp.role}
                        </h3>
                        <p className={`text-sm font-semibold ${cfg.text} mt-1`}>{exp.companyFull || exp.company}</p>
                      </div>

                      <div className="flex flex-col items-end text-xs text-gray-500 gap-1.5">
                        <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          {startStr} — {endStr}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-600" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {exp.summary && (
                      <p className="text-sm text-gray-400 leading-relaxed mb-5 pb-5 border-b border-white/5">
                        {exp.summary}
                      </p>
                    )}

                    {/* Highlight chips */}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 mb-5">
                        {exp.highlights.map((h, hIdx) => (
                          <div key={hIdx} className={`flex items-center gap-1.5 text-[10px] font-semibold ${cfg.text} ${cfg.bg} border ${cfg.border} px-3 py-1.5 rounded-full`}>
                            <h.icon className="w-3 h-3" />
                            {h.text}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bullet points */}
                    <ul className="flex flex-col gap-2 mb-5">
                      {exp.description.map((desc, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
                          <span className={`${cfg.text} mt-1 shrink-0`}>→</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tech stack */}
                    {exp.techStack && exp.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                        {exp.techStack.map((tech, tIdx) => (
                          <span key={tIdx} className="text-[9px] font-semibold text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded uppercase tracking-wide">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
