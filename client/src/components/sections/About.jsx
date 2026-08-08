import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, Compass, Eye, BookOpen, Calendar, GraduationCap, Trophy, Star, Zap, Brain, Code2, Users } from 'lucide-react';

const About = ({ education = [], aboutMe = {}, isLoading = false }) => {
  const educationRecords = education;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const pillars = [
    {
      icon: Brain,
      title: 'AI & Machine Learning',
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
      text: 'Deeply passionate about LLMs, RAG architectures, local model deployment with Ollama, and bridging AI with real-world web systems. I fine-tune prompts, build vector search pipelines, and integrate LangChain into production-ready backends.',
    },
    {
      icon: Code2,
      title: 'Full Stack Development',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'Expert in the MERN stack — MongoDB, Express, React, Node.js. I build scalable REST APIs, implement JWT-secured sessions, use code-splitting for performance, and architect MVC-pattern applications that are clean, fast, and maintainable.',
    },
    {
      icon: Trophy,
      title: 'Hackathons & Problem Solving',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'A seasoned hackathon competitor with 9+ achievements including wins at national and state levels. I thrive under pressure — ideating, prototyping, and shipping functional solutions within tight deadlines. Competitive programming across LeetCode and GeeksforGeeks.',
    },
    {
      icon: Users,
      title: 'Leadership & Community',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      text: 'Serving as Assistant Secretary at GDG On Campus, I coordinate hackathons, technical workshops, and speaker events for 500+ participants. I believe great engineers grow communities, not just codebases.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-bgDark relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute top-[30%] left-[-5%] w-[300px] h-[300px] aurora-blur-1 pointer-events-none rounded-full opacity-40" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Background</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            About <span className="gradient-text text-glow">Me</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full mt-4" />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-gray-400 max-w-2xl text-sm sm:text-base leading-relaxed"
          >
            I am a third-year B.Tech student in Artificial Intelligence & Machine Learning at Walchand College of Engineering, Sangli, with a CGPA of <span className="text-indigo-300 font-semibold">8.95</span>. I combine strong academics with hands-on projects, hackathon wins, and community leadership to build a holistic engineering profile.
          </motion.p>
        </div>

        {/* 4-pillar grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl glass-card border border-white/5 hover:border-white/12 group transition-all duration-300 glass-card-hover"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 ${pillar.bg} rounded-xl border ${pillar.border} ${pillar.color}`}>
                  <pillar.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-display font-semibold text-white">{pillar.title}</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{pillar.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Education Timeline */}
        <div>
          <div className="flex flex-col items-center text-center mb-10">
            <h3 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
              <span>Education <span className="gradient-text">Timeline</span></span>
            </h3>
            <div className="w-8 h-0.5 bg-indigo-600 rounded-full mt-3" />
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/60 via-violet-500/30 to-transparent" />

            {isLoading ? (
              Array.from({ length: 2 }).map((_, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div
                    key={idx}
                    className={`relative mb-12 animate-pulse ${
                      isLeft
                        ? 'pl-16 sm:pl-0 sm:pr-[calc(50%+2rem)] sm:text-right'
                        : 'pl-16 sm:pl-[calc(50%+2rem)]'
                    }`}
                  >
                    <div className="absolute left-0 sm:left-1/2 top-4 -translate-x-1/2 w-12 h-12 rounded-xl bg-[#0b0b18] border-2 border-white/5" />
                    <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col gap-3">
                      <div className={`h-4 w-1/4 rounded bg-white/5 ${isLeft ? 'sm:ml-auto' : ''}`} />
                      <div className="h-5 w-3/4 rounded bg-white/5" />
                      <div className="h-4 w-1/2 rounded bg-white/5" />
                    </div>
                  </div>
                );
              })
            ) : educationRecords.length === 0 ? (
              <div className="text-center py-10 text-gray-600">
                <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No education records found.</p>
              </div>
            ) : (
              educationRecords.map((edu, idx) => {
                const yearRange = edu.currentYear || (edu.startDate ? `${new Date(edu.startDate).getFullYear()} – ${edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}` : '');
                const isLeft = idx % 2 === 0;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className={`relative mb-12 ${
                      isLeft
                        ? 'pl-16 sm:pl-0 sm:pr-[calc(50%+2rem)] sm:text-right'
                        : 'pl-16 sm:pl-[calc(50%+2rem)]'
                    }`}
                  >
                    {/* Circle node */}
                    <div className="absolute left-0 sm:left-1/2 top-4 -translate-x-1/2 w-12 h-12 rounded-xl bg-[#0b0b18] border-2 border-indigo-500 flex items-center justify-center text-indigo-400 shadow-lg z-10">
                      <GraduationCap className="w-5 h-5" />
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all duration-300 group glass-card-hover">
                    
                    {/* Year badge */}
                    <div className={`flex items-center gap-2 mb-3 ${isLeft ? 'sm:justify-end' : ''}`}>
                      <span className="flex items-center gap-1 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                        <Calendar className="w-3 h-3" />
                        {yearRange}
                      </span>
                      {edu.highlight === 'btech' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full animate-glow-pulse">
                          <Star className="w-3 h-3" />
                          {edu.cgpa} CGPA
                        </span>
                      )}
                      {edu.highlight === 'diploma' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                          <Trophy className="w-3 h-3" />
                          {edu.marks}%
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-display font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">
                      {edu.degree}
                    </h4>
                    <p className="text-sm text-indigo-400/80 mt-1 font-medium">{edu.institution}</p>

                    {/* Extra badge for diploma */}
                    {edu.highlight === 'diploma' && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Trophy className="w-2.5 h-2.5" /> College Topper
                        </span>
                        <span className="text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-300 font-bold px-2 py-0.5 rounded-full">
                          🏆 State Rank 330
                        </span>
                        <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                          Gov. Scholarship
                        </span>
                      </div>
                    )}

                    {/* Extra badge for btech */}
                    {edu.highlight === 'btech' && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                          AI & ML Specialization
                        </span>
                        <span className="text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-300 font-bold px-2 py-0.5 rounded-full">
                          GDG Chapter Lead
                        </span>
                      </div>
                    )}

                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Key Highlights</h5>
                        <ul className="flex flex-col gap-1.5">
                          {edu.achievements.map((ach, aIdx) => (
                            <li key={aIdx} className={`flex items-start gap-2 text-xs text-gray-400 ${isLeft ? 'sm:flex-row-reverse sm:text-right' : ''}`}>
                              <Zap className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
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

export default About;
