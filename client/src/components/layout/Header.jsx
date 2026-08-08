import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search, Command, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api.js';

const Header = ({ onOpenCommandPalette }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll tracking for progress bar and background blur triggers
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch dynamic navigation links from DB
  const { data: navRes } = useQuery({
    queryKey: ['navigation-links'],
    queryFn: () => api.get('/navigation'),
  });

  // Fetch branding settings from DB
  const { data: settingsRes } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings'),
  });

  const settings = settingsRes?.data?.data || {};
  const logo = settings.logo;
  const siteName = settings.homeHero?.name || 'MADANRAJ';

  const links = navRes?.data?.data || [
    { label: 'About', path: '/#about' },
    { label: 'Achievements', path: '/#achievements' },
    { label: 'Projects', path: '/#projects' },
    { label: 'Skills', path: '/#skills' },
    { label: 'Experience', path: '/#experience' },
    { label: 'Coding Profiles', path: '/#coding-profiles' },
    { label: 'Contact', path: '/#contact' },
  ];

  const handleLinkClick = (path) => {
    setIsOpen(false);
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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030307]/80 backdrop-blur-md border-b border-white/5 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      {/* Top Scroll Progress Indicator */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-violet-500 via-indigo-500 to-pink-500 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Branding Logo */}
        <Link
          to="/"
          className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-2 group"
        >
          {logo ? (
            <img src={logo} alt="Logo" className="h-8 w-auto rounded-lg object-contain" />
          ) : (
            <>
              <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-transparent bg-clip-text font-black">
                {siteName.toUpperCase()}
              </span>
              <span className="text-xs text-indigo-400 border border-indigo-500/30 rounded px-1.5 py-0.5 group-hover:bg-indigo-500/10 transition-colors">
                DEV
              </span>
            </>
          )}
        </Link>

        {/* Desktop Navigation Link items */}
        <nav className="hidden lg:flex items-center gap-8 relative">
          {links.map((link) => {
            const hash = link.path.startsWith('/#') ? link.path.substring(2) : '';
            const isActive = hash ? location.hash === `#${hash}` || (location.hash === '' && hash === 'about' && window.scrollY < 200) : false;
            return (
              <button
                key={link.label || link._id}
                onClick={() => handleLinkClick(link.path)}
                className={`text-sm font-medium transition-all duration-300 relative py-1.5 ${
                  isActive ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-amber-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls Area */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Global Search Button */}
          <button
            onClick={onOpenCommandPalette}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all flex items-center gap-2 group"
            title="Search command palette (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-gray-400 group-hover:text-purple-300" />
            <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 border border-white/5 flex items-center gap-0.5">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-pulse-slow" />
            ) : (
              <Moon className="w-4 h-4 text-purple-400" />
            )}
          </button>

          {/* Admin Settings Access */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 text-purple-300 transition-all"
                title="Admin Dashboard"
              >
                <User className="w-4 h-4" />
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 text-rose-300 transition-all"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-semibold text-purple-300 hover:text-white border border-purple-500/30 px-3.5 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/25 transition-all duration-200 shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile controls & toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
          
          <button
            onClick={onOpenCommandPalette}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Expanding Circular Clip-Path Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 30px)', opacity: 0 }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 30px)', opacity: 1 }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 30px)', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed inset-0 top-0 bg-[#070712]/98 backdrop-blur-2xl z-40 px-8 pt-24 pb-12 flex flex-col justify-between border-b border-white/10"
          >
            <div className="flex flex-col gap-5">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-2">Navigation Menu</span>
              {links.map((link, idx) => (
                <motion.button
                  key={link.label || link._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05, duration: 0.4 }}
                  onClick={() => handleLinkClick(link.path)}
                  className="text-2xl font-display font-black text-left text-white hover:text-indigo-400 py-1.5 border-b border-white/5 transition-colors flex items-center justify-between group"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-indigo-500 font-bold group-hover:translate-x-1 transition-transform">→</span>
                </motion.button>
              ))}
            </div>

            {isAdmin ? (
              <div className="flex flex-col gap-3 mt-6">
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 bg-indigo-600 rounded-xl text-white font-semibold text-sm"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-3 bg-rose-600/20 border border-rose-500/30 text-rose-300 rounded-xl font-semibold text-sm"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3.5 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-semibold text-sm rounded-xl mt-6 shadow-lg shadow-indigo-500/25"
              >
                Sign In to Dashboard
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
