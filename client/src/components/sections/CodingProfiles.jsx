import React from 'react';
import { motion } from 'framer-motion';
import { Github, Code2, Linkedin, Download, ExternalLink, Star, GitBranch, BookOpen, Trophy, Activity } from 'lucide-react';

// GitHub username constant
const GITHUB_USERNAME = 'madanrajsagar';
const LEETCODE_USERNAME = 'madanrajsagar';

const CodingProfiles = () => {
  const profiles = [
    {
      name: 'GitHub',
      handle: `@${GITHUB_USERNAME}`,
      url: `https://github.com/${GITHUB_USERNAME}`,
      icon: Github,
      color: 'text-white',
      bg: 'bg-white/5',
      border: 'border-white/10',
      hoverBorder: 'hover:border-white/25',
      glow: 'hover:shadow-white/5',
      stats: ['4+ Projects', '100+ Commits', 'Open Source Contributor'],
      description: 'Explore my repositories, open source contributions, and coding activity. Full stack projects, AI experiments, and more.',
    },
    {
      name: 'LeetCode',
      handle: `@${LEETCODE_USERNAME}`,
      url: 'https://leetcode.com/u/madanrajsagar/',
      icon: Code2,
      color: 'text-amber-400',
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/15',
      hoverBorder: 'hover:border-amber-500/30',
      glow: 'hover:shadow-amber-500/5',
      stats: ['350+ Problems', 'Rating 1400+', 'Consistent Streak'],
      description: 'Data structures, algorithms, and competitive programming. Consistent problem-solving across difficulty levels.',
    },
    {
      name: 'CodeChef',
      handle: `@madanrajsagar`,
      url: 'https://www.codechef.com/users/madanrajsagar',
      icon: Trophy,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/15',
      hoverBorder: 'hover:border-emerald-500/30',
      glow: 'hover:shadow-emerald-500/5',
      stats: ['Competitive Programming', 'Rating 1400+', 'Active Contestant'],
      description: 'Algorithm practice and active participation in CodeChef programming contests.',
    },
    {
      name: 'LinkedIn',
      handle: '@madanraj-sagar-0a700a308',
      url: 'https://www.linkedin.com/in/madanraj-sagar-0a700a308/',
      icon: Linkedin,
      color: 'text-blue-400',
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/15',
      hoverBorder: 'hover:border-blue-500/30',
      glow: 'hover:shadow-blue-500/5',
      stats: ['Professional Network', 'Project Showcases', 'Technical Articles'],
      description: 'Professional network, project achievements, internship updates, and technical content sharing.',
    },
    {
      name: 'Resume',
      handle: 'Download PDF',
      url: '/resume',
      icon: Download,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/5',
      border: 'border-indigo-500/15',
      hoverBorder: 'hover:border-indigo-500/30',
      glow: 'hover:shadow-indigo-500/5',
      stats: ['B.Tech AI & ML', 'CGPA 9.29', 'Active GDG Web Lead'],
      description: 'Download my full resume with education, projects, skills, hackathon wins, and GDG leadership experience.',
      isResume: true,
    },
  ];

  const handleProfileClick = (profile) => {
    if (profile.isResume) {
      window.open('/resume', '_blank');
      return;
    }
    window.open(profile.url, '_blank', 'noopener noreferrer');
  };

  return (
    <section id="coding-profiles" className="py-24 bg-[#05050b] relative overflow-hidden">
      <div className="absolute top-[10%] right-[-5%] w-[300px] h-[300px] aurora-blur-2 pointer-events-none rounded-full opacity-50" />
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
            <Activity className="w-3.5 h-3.5" />
            <span>Online Presence</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Coding <span className="gradient-text text-glow">Profiles</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full mt-4" />
          <p className="mt-4 text-gray-500 text-sm max-w-lg">
            Find me across platforms — GitHub repositories, LeetCode challenges, CodeChef contest achievements, and LinkedIn.
          </p>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-14">
          {profiles.map((profile, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              data-cursor="VISIT"
              onClick={() => handleProfileClick(profile)}
              className={`coding-profile-card p-6 rounded-2xl glass-card border ${profile.border} ${profile.hoverBorder} cursor-pointer flex flex-col gap-4 hover:shadow-lg ${profile.glow} transition-all duration-300 group clickable`}
            >
              {/* Icon + name */}
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${profile.bg} border ${profile.border} group-hover:scale-110 transition-transform duration-300`}>
                  <profile.icon className={`w-6 h-6 ${profile.color}`} />
                </div>
                <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div>
                <h3 className={`font-display font-bold text-white text-base group-hover:${profile.color} transition-colors`}>{profile.name}</h3>
                <p className={`text-xs font-semibold ${profile.color} mt-0.5`}>{profile.handle}</p>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">{profile.description}</p>

              {/* Stats chips */}
              <div className="flex flex-col gap-1.5 pt-3 border-t border-white/5">
                {profile.stats.map((stat, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold">
                    <span className={`w-1 h-1 rounded-full ${profile.color.replace('text-', 'bg-')}`} />
                    {stat}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default CodingProfiles;
