import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Code2, Brain, GraduationCap, Users, Zap, HelpCircle } from 'lucide-react';

const WhyHireMe = () => {
  const points = [
    {
      icon: Trophy,
      title: 'Proven Hackathon Performer',
      description: 'Multiple awards including 1st Runner-Up at HackoutSav and Winner at AI Prompt Battle & Reimagine. Fast prototyping and execution under pressure.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      icon: Code2,
      title: 'AI + Full Stack Developer',
      description: 'Bridges the gap between backend engineering and AI models. Hands-on experience building MERN apps and deploying local LLMs with LangChain.',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
    {
      icon: Brain,
      title: 'Strong Problem Solver',
      description: '350+ LeetCode problems solved with rating 1400+. Strong foundation in Data Structures, Algorithms, and analytical thinking.',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
    },
    {
      icon: GraduationCap,
      title: 'Excellent Academic Record',
      description: 'Current 9.36 CGPA (Rank 2 in Class) in B.Tech AI & ML at Walchand College. Overall 95.09% marks and Rank 1 College Topper in Diploma.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      icon: Users,
      title: 'Leadership & Teamwork',
      description: 'Assistant Secretary & Web Team Lead at GDG On Campus. Coordinated tech events for 500+ attendees and managed developer circles.',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
    },
    {
      icon: Zap,
      title: 'Fast Learner',
      description: 'Constantly tracking emerging technologies. Rapidly picked up LangChain, Ollama, Docker, and AWS during B.Tech courses.',
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
    },
  ];

  return (
    <section id="why-hire-me" className="py-24 bg-bgDark relative overflow-hidden">
      <div className="absolute top-[30%] right-[-10%] w-[300px] h-[300px] aurora-blur-2 pointer-events-none rounded-full opacity-35" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Recruiter Value Proposition</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Why <span className="gradient-text text-glow">Hire Me?</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full mt-4" />
          <p className="mt-4 text-gray-500 text-sm max-w-lg">
            Core reasons why I will make a valuable addition to your engineering and software development team.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`p-6 rounded-3xl glass-card border border-white/5 hover:${p.border} hover:shadow-glow transition-all duration-300 group glass-card-hover`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 ${p.bg} rounded-xl border ${p.border} ${p.color} group-hover:scale-110 transition-transform duration-300`}>
                  <p.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-display font-bold text-white group-hover:text-indigo-200 transition-colors leading-tight">
                  {p.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {p.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyHireMe;
