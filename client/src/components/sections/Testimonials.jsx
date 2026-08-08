import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquareQuote, Award, UserCheck, ShieldCheck } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'HackoutSav Hackathon Jury Panel',
      role: 'Inter-College Hackathon Mentors',
      organization: 'Maharashtra Technical Association',
      content: 'Madanraj and team delivered an exceptional 24-hour full-stack prototype. Their REST API architecture, real-time database schema, and presentation depth earned them 1st Runner-Up among 100+ competing teams.',
      rating: 5,
      badge: 'Hackathon Judge Panel',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      name: 'Google Developer Groups (GDG)',
      role: 'Core Team & Faculty Mentors',
      organization: 'Walchand College Chapter',
      content: 'As Web Team Lead & Assistant Secretary, Madanraj led the execution of state-level technical fests for 500+ attendees. His full-stack engineering skills and leadership grew chapter membership by 40%.',
      rating: 5,
      badge: 'GDG Leadership Review',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
    {
      name: 'Department Faculty Evaluation',
      role: 'Computer Technology Board',
      organization: 'MSBTE / WCE Sangli',
      content: 'Rank 1 College Topper for 4 consecutive semesters (95.09% aggregate). Madanraj consistently demonstrates outstanding problem-solving fundamentals, OOP design principles, and software implementation discipline.',
      rating: 5,
      badge: 'Academic Excellence',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-[#030307] relative overflow-hidden">
      <div className="absolute top-[10%] left-[-5%] w-[300px] h-[300px] aurora-blur-1 pointer-events-none rounded-full opacity-40" />
      <div className="absolute bottom-[10%] right-[-5%] w-[250px] h-[250px] aurora-blur-2 pointer-events-none rounded-full opacity-30" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Endorsements & Reviews</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Peer <span className="gradient-text text-glow">Testimonials</span> & Reviews
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full mt-4" />
          <p className="mt-4 text-gray-500 text-sm max-w-lg">
            Feedback and commendations from hackathon judges, GDG leads, and academic faculty members.
          </p>
        </div>

        {/* 3D Tilt Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              data-cursor="OPEN"
              className={`p-6 rounded-3xl glass-card border ${t.border} flex flex-col justify-between gap-6 hover:shadow-glow transition-all duration-300 relative group overflow-hidden clickable`}
            >
              {/* Subtle accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${t.color} ${t.bg} ${t.border}`}>
                    {t.badge}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${t.bg} border ${t.border} flex items-center justify-center font-bold text-sm ${t.color}`}>
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-display font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">
                    {t.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-semibold">{t.role} · {t.organization}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
