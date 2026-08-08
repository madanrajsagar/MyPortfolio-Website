import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Code2, GraduationCap, Laptop, Compass, Milestone } from 'lucide-react';

const JourneyTimeline = () => {
  const steps = [
    {
      icon: BookOpen,
      title: 'Diploma in Computer Technology',
      period: '2020 – 2023',
      description: 'Began official training in computer science. Built core fundamentals in operating systems, C/C++, Java, and algorithms.',
      color: 'text-violet-400',
      border: 'border-violet-500/20',
      bg: 'bg-violet-500/10',
    },
    {
      icon: Trophy,
      title: 'College Topper & State Rank 330',
      period: '2023',
      description: 'Completed Diploma at Rank 1 overall with 95.09% marks. Received Government Scholarship and placed in Maharashtra state merit list.',
      color: 'text-amber-400',
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Code2,
      title: 'Hackathons & LeetCode Streak',
      period: '2023 – 2024',
      description: 'Entered competitive coding. Solved 350+ algorithms on LeetCode (1400+ rating) and began building rapid prototypes for hackathons.',
      color: 'text-indigo-400',
      border: 'border-indigo-500/20',
      bg: 'bg-indigo-500/10',
    },
    {
      icon: GraduationCap,
      title: 'Walchand College of Engineering',
      period: '2023 – Present',
      description: 'Admitted to B.Tech in Artificial Intelligence & Machine Learning. Assistant Secretary at GDG Chapter, currently maintaining 9.29 CGPA.',
      color: 'text-emerald-400',
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Laptop,
      title: 'Full Stack & AI Projects',
      period: '2024 – 2026',
      description: 'Engineered complete software platforms — MERN applications, local AI prompt engines, safety trackers, and academic repositories.',
      color: 'text-pink-400',
      border: 'border-pink-500/20',
      bg: 'bg-pink-500/10',
    },
    {
      icon: Compass,
      title: 'Current Placement Ready',
      period: 'Ongoing',
      description: 'Seeking AI/ML and Full Stack software engineering internship placements at top product companies.',
      color: 'text-sky-400',
      border: 'border-sky-500/20',
      bg: 'bg-sky-500/10',
    },
  ];

  return (
    <section id="journey" className="py-24 bg-[#05050b] relative overflow-hidden">
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] aurora-blur-1 pointer-events-none rounded-full opacity-30" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <Milestone className="w-3.5 h-3.5" />
            <span>Growth & Milestones</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            My Professional <span className="gradient-text text-glow">Journey</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full mt-4" />
          <p className="mt-4 text-gray-500 text-sm max-w-lg">
            A chronological timeline showcasing my progression from foundational computing studies to AI specialization.
          </p>
        </div>

        {/* Timeline body */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Vertical Line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/60 via-violet-500/30 to-transparent" />

          {steps.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className={`relative mb-12 ${
                  isLeft
                    ? 'pl-16 sm:pl-0 sm:pr-[calc(50%+2rem)] sm:text-right'
                    : 'pl-16 sm:pl-[calc(50%+2rem)]'
                }`}
              >
                {/* Node icon */}
                <div className={`absolute left-0 sm:left-1/2 top-3 -translate-x-1/2 w-12 h-12 rounded-xl bg-[#0b0b18] border-2 border-indigo-500 flex items-center justify-center ${step.color} shadow-lg z-10 hover:scale-115 transition-transform`}>
                  <step.icon className="w-5 h-5" />
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all duration-300 group glass-card-hover text-left">
                  <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'sm:justify-end' : ''}`}>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${step.color} ${step.bg} ${step.border}`}>
                      {step.period}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-display font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default JourneyTimeline;
