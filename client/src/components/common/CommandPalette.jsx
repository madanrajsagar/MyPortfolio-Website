import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FolderGit2, BookOpen, Award, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import api from '../../services/api.js';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Listen to keyboard shortcuts (Ctrl+K to toggle, Escape to close)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      searchInputRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle typing & perform queries
  useEffect(() => {
    if (!query.trim()) {
      // Default shortcuts/routes when query is empty
      setResults([
        { id: 'nav-projects', title: 'Browse Projects', category: 'Navigation', icon: FolderGit2, action: () => navigate('/#projects') },
        { id: 'nav-about', title: 'Learn About Madanraj', category: 'Navigation', icon: FileText, action: () => navigate('/#about') },
        { id: 'nav-certificates', title: 'View Certificates', category: 'Navigation', icon: Award, action: () => navigate('/certificates') },
        { id: 'nav-resume', title: 'View Resume', category: 'Navigation', icon: FileText, action: () => navigate('/resume') },
      ]);
      setSelectedIndex(0);
      return;
    }

    const fetchSearchData = async () => {
      setLoading(true);
      try {
        // Query projects and blogs matching criteria
        const [projectsRes, blogsRes] = await Promise.all([
          api.get(`/projects?search=${query}`),
          api.get(`/blogs?search=${query}`),
        ]);

        const projectItems = (projectsRes.data?.data || []).map(p => ({
          id: `p-${p._id}`,
          title: p.title,
          category: 'Projects',
          icon: FolderGit2,
          action: () => navigate(`/projects/${p.slug}`),
        }));

        const blogItems = (blogsRes.data?.data || []).map(b => ({
          id: `b-${b._id}`,
          title: b.title,
          category: 'Blogs',
          icon: BookOpen,
          action: () => navigate(`/blogs/${b.slug}`),
        }));

        setResults([...projectItems, ...blogItems]);
        setSelectedIndex(0);
      } catch (err) {
        console.error('Command palette search error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSearchData, 300);
    return () => clearTimeout(timer);
  }, [query, navigate]);

  // Handle keyboard events (ArrowUp, ArrowDown, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          results[selectedIndex].action();
          onClose();
          setQuery('');
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-bgDark/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0b0b14] border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-500 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, blogs, pages..."
            className="w-full bg-transparent border-0 text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-base"
          />
          <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 border border-white/5 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[350px] overflow-y-auto p-2">
          {loading ? (
            <div className="py-8 text-center text-sm text-gray-500">Searching indexes...</div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No results found.</div>
          ) : (
            <div>
              {results.map((item, idx) => {
                const IconComponent = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      item.action();
                      onClose();
                      setQuery('');
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-600/20 text-white border border-indigo-500/20' : 'text-gray-400 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-gray-500'}`} />
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-600 bg-white/5 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-1.5 text-xs text-indigo-400">
                        <span>Go</span>
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer tips */}
        <div className="p-3 border-t border-white/5 bg-[#08080f] flex justify-between items-center text-[10px] text-gray-500">
          <div className="flex gap-4">
            <span>↑↓ to navigate</span>
            <span>Enter to select</span>
          </div>
          <span>Command Palette v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
