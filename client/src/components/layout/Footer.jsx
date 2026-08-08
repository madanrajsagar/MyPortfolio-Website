import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart, ArrowUp, Code2, Star, Trophy, GraduationCap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api.js';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch dynamic settings from DB
  const { data: settingsRes } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings'),
  });

  const settings = settingsRes?.data?.data || {};
  const socialLinks = settings.socialLinks || {};
  const logo = settings.logo;
  const siteName = settings.homeHero?.name || 'MADANRAJ';

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    if (path.startsWith('/#')) {
      const sectionId = path.substring(2);
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: sectionId } });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(path);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'About Me', path: '/#about' },
    { label: 'Highlights', path: '/#highlights' },
    { label: 'Achievements', path: '/#achievements' },
    { label: 'Projects Showcase', path: '/#projects' },
    { label: 'Skills & Toolkit', path: '/#skills' },
    { label: 'Certificates', path: '/#certificates' },
    { label: 'Contact', path: '/#contact' },
  ];

  const profileLinks = [
    { label: 'GitHub Profile', href: socialLinks.github || 'https://github.com', icon: Github },
    { label: 'LinkedIn Profile', href: socialLinks.linkedin || 'https://linkedin.com', icon: Linkedin },
    { label: 'LeetCode Stats', href: socialLinks.leetcode || 'https://leetcode.com', icon: Code2 },
    { label: 'Direct Email', href: `mailto:${socialLinks.email || 'madanrajsagar83@gmail.com'}`, icon: Mail },
  ];

  const techStack = [
    'MERN Stack',
    'AI & Machine Learning',
    'LangChain & Local LLMs',
    'Python / PyTorch',
    'Tailwind CSS',
    'Docker & DevOps',
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative border-t border-white/5 bg-[#030307] pt-20 pb-12 overflow-hidden"
    >
      {/* Decorative backdrop glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] aurora-blur-2 pointer-events-none rounded-full opacity-40" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start mb-16">
        
        {/* Column 1: Branding & Intro */}
        <div className="lg:col-span-4 flex flex-col gap-4 text-left">
          {logo ? (
            <img src={logo} alt="Logo" className="h-8 w-auto rounded-lg object-contain align-middle" />
          ) : (
            <h3 className="font-display font-black text-xl text-white tracking-wider">
              {siteName.toUpperCase()}
            </h3>
          )}
          <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
            AIML Student at Walchand College of Engineering (CGPA 9.29). Building intelligent full stack MERN web platforms, local AI models, and community structures.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full relative shrink-0">
              <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping" />
            </span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              Open for Internships & Positions
            </span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">
            Navigation
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-400">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className="hover:text-indigo-400 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Profiles & Resume */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">
            Connect & Resume
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-400">
            {profileLinks.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.label}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{p.label}</span>
                  </a>
                </li>
              );
            })}
            <li className="mt-1">
              <button
                onClick={() => {
                  if (settings.resumeUrl) {
                    window.open(settings.resumeUrl, '_blank');
                  } else {
                    alert('Please contact me directly for the latest resume!');
                  }
                }}
                className="text-[10px] text-white font-bold bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:border-indigo-500 transition-all uppercase tracking-wider"
              >
                Download CV / Resume
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Tech Stack */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">
            Tech Toolkit
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="text-[9px] bg-white/5 border border-white/8 px-2.5 py-1 rounded text-gray-400 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Copyright & Back to Top */}
      <div className="max-w-7xl mx-auto px-6 mt-6 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-gray-600">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <span>&copy; {currentYear} Madanraj S. All rights reserved.</span>
          <span className="hidden sm:inline text-gray-800">|</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" /> using React & Tailwind
          </span>
        </div>

        {/* Smooth Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-white/10 text-[10px] uppercase font-bold text-gray-400 hover:text-white transition-all group clickable"
          title="Back to Top"
        >
          <span>Top</span>
          <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.footer>
  );
};

export default Footer;
