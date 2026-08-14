import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail, Github, Linkedin, Award, Code2, Cpu, Trophy, Layers, BookOpen, Star } from 'lucide-react';
import api from '../../services/api.js';

// Animated counter hook
const useCounter = (target, duration = 1800, shouldStart = false, decimals = 0) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      setCount(decimals > 0 ? parseFloat(val.toFixed(decimals)) : Math.floor(val));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, shouldStart, decimals]);
  return count;
};

const Counter = ({ target, suffix = '+', label, decimals = 0, color }) => {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const value = useCounter(target, 1800, started, decimals);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <div className={`text-2xl sm:text-3xl font-display font-black counter-value ${color}`}>
        {value}{suffix}
      </div>
      <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider text-center leading-tight">
        {label}
      </div>
    </div>
  );
};

const Hero = ({ settings = {} }) => {
  const [typedText, setTypedText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = (Array.isArray(settings.homeHero?.typingText) && settings.homeHero.typingText.length > 0)
    ? settings.homeHero.typingText
    : ['AI Engineer', 'Full Stack Developer', 'Competitive Programmer'];

  // Typing animation cycle
  useEffect(() => {
    const activeRole = roles[roleIndex % roles.length] || 'Full Stack Developer';
    let typingSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex === activeRole.length) {
      typingSpeed = 1500;
      setIsDeleting(true);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    const timer = setTimeout(() => {
      setTypedText(
        isDeleting
          ? activeRole.substring(0, charIndex - 1)
          : activeRole.substring(0, charIndex + 1)
      );
      setCharIndex((prev) => (isDeleting ? prev - 1 : prev + 1));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex, roles]);

  const handleDownloadResume = async () => {
    try {
      await api.post('/analytics/download', {
        target: settings.resumeUrl || 'resume.pdf',
      }).catch(err => console.error(err));

      if (settings.resumeUrl) {
        window.open(settings.resumeUrl, '_blank');
      } else {
        alert('Resume file is being updated. Please check back shortly or contact me directly!');
      }
    } catch (err) {
      console.error('Resume download log failure:', err.message);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/portfolio/madanraj.png";
  };

  const socialLinks = settings.socialLinks || {};

  const counters = [
    { target: 4, suffix: '', label: 'Major Projects', color: 'text-indigo-400' },
    { target: 9, suffix: '+', label: 'Technical Achievements', color: 'text-violet-400' },
    { target: 9.36, suffix: '', decimals: 2, label: 'CGPA', color: 'text-emerald-400' },
    { target: 100, suffix: '%', label: 'AI + FS Developer', color: 'text-sky-400' },
  ];

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || window.innerWidth < 1024) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - (left + width / 2)) / (width / 2); // -1 to 1
      const y = (e.clientY - (top + height / 2)) / (height / 2); // -1 to 1
      setCoords({ x: x * 12, y: y * 12 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[92vh] flex items-center justify-center py-20 overflow-hidden bg-grid-pattern">
      {/* Animated background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/8 blur-[140px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-violet-500/6 blur-[100px] rounded-full pointer-events-none animate-float" />
      <div className="absolute bottom-[10%] left-[5%] w-[250px] h-[250px] bg-pink-500/5 blur-[90px] rounded-full pointer-events-none" style={{ animationDelay: '1.5s' }} />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-indigo-400/30 pointer-events-none"
          style={{
            top: `${15 + i * 15}%`,
            left: `${5 + i * 14}%`,
            animation: `drift ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative z-10">
        
        {/* Left text area */}
        <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-amber-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold shadow-sm"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span>Open to internships & full-time roles</span>
          </motion.div>

          <div className="text-mask-wrapper">
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-white leading-tight"
            >
              {settings.homeHero?.title || "Hello, I'm"} <br />
              <span className="gradient-text font-black text-glow">{settings.homeHero?.name || 'Madanraj Sagar'}</span>
            </motion.h1>
          </div>

          {/* Mission tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="text-sm font-semibold text-blue-400/90 uppercase tracking-[0.2em] -mt-2"
          >
            {settings.homeHero?.subtitle || "Building Intelligent Systems · Solving Real Problems"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="h-10 text-lg sm:text-xl font-medium text-purple-200"
          >
            <span>I build solutions as a </span>
            <span className="border-r-2 border-amber-400 pr-1 py-0.5 font-semibold text-white">
              {typedText}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.34 }}
            className="text-gray-400 max-w-xl text-sm sm:text-base leading-relaxed"
          >
            {settings.homeHero?.description || "B.Tech AIML Student at Walchand College of Engineering • Full Stack Developer • AI/ML Enthusiast • Competitive Programmer • Hackathon Winner • Building scalable real-world software solutions."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2 flex-wrap justify-center lg:justify-start"
          >
            <button
              data-cursor="CLICK"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-purple-500/25 group clickable"
            >
              <span>{settings.homeHero?.ctaText || 'View Projects'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </button>

            <button
              data-cursor="CLICK"
              onClick={handleDownloadResume}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 text-white font-semibold text-sm transition-all clickable"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download CV</span>
            </button>

            <a
              data-cursor="VISIT"
              href={socialLinks.github || 'https://github.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-sm transition-all clickable"
            >
              <Github className="w-4 h-4 text-gray-300" />
            </a>

            <a
              data-cursor="VISIT"
              href={socialLinks.linkedin || 'https://linkedin.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 text-blue-400 font-semibold text-sm transition-all clickable"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Social quick links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex gap-4 items-center mt-2"
          >
            <span className="text-xs uppercase tracking-widest text-gray-600">Also find me:</span>
            <a
              href={`mailto:${socialLinks.email || 'madanrajsagar83@gmail.com'}`}
              className="text-xs text-gray-500 hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </a>
            <a
              href={socialLinks.leetcode || 'https://leetcode.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5" />
              LeetCode
            </a>
          </motion.div>

          {/* Achievement Counters */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="w-full mt-4 pt-6 border-t border-white/5"
          >
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-4 text-center lg:text-left">By the numbers</p>
            <div className="grid grid-cols-5 gap-4">
              {counters.map((c, i) => (
                <Counter key={i} {...c} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right profile image card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="order-1 lg:order-2 lg:col-span-5 flex justify-center items-center w-full relative group min-h-[360px] sm:min-h-[460px]"
        >
          {/* Blurred radial glow behind the image */}
          <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-pink-500/10 rounded-full blur-[90px] pointer-events-none group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] bg-gradient-to-tr from-blue-500/15 via-purple-500/10 to-transparent rounded-full blur-[70px] pointer-events-none" />

          {/* Slight floating + parallax mouse container */}
          <motion.div 
            style={{ x: coords.x, y: coords.y }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[260px] sm:w-[300px] lg:w-[330px] aspect-[3/4] rounded-[2.5rem] p-[1.5px] bg-gradient-to-br from-indigo-500 via-transparent to-pink-500/40 shadow-2xl group-hover:shadow-glow transition-all duration-500"
          >
            {/* Elegant glassmorphic outer frame */}
            <div className="w-full h-full rounded-[2.4rem] bg-[#0c0c16]/80 backdrop-blur-xl p-3 flex items-center justify-center overflow-hidden relative">
              
              {/* Internal subtle gradient glow behind the photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 via-transparent to-transparent pointer-events-none z-10" />

              {/* The Photo itself */}
              <img
                src={settings.homeHero?.profileImage || settings.avatar || "/portfolio/madanraj.png"}
                alt={settings.homeHero?.name || "Madanraj Sagar"}
                onError={handleImageError}
                className="w-full h-full object-cover rounded-[2rem] object-top group-hover:scale-[1.03] transition-transform duration-700"
              />

              {/* Glass overlay subtle bottom banner */}
              <div className="absolute bottom-6 left-6 right-6 p-3 rounded-2xl bg-bgDark/80 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-xl z-20">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-purple-300 font-bold uppercase tracking-widest truncate max-w-[180px]">
                    {settings.homeHero?.subtitle || "AI/ML & MERN Developer"}
                  </span>
                  <span className="text-xs font-bold text-white mt-0.5">
                    {settings.homeHero?.name || "Madanraj S"}
                  </span>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full relative shrink-0">
                  <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping" />
                </div>
              </div>

            </div>
          </motion.div>


          {/* Elegant floating background particles */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-violet-400/30 pointer-events-none z-10"
              style={{
                top: `${20 + i * 15}%`,
                left: `${15 + i * 14}%`,
                animation: `drift ${5 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
