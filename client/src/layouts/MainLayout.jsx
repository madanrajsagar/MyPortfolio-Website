import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import CustomCursor from '../components/layout/CustomCursor.jsx';
import ParticlesCanvas from '../components/common/ParticlesCanvas.jsx';
import ChatBot from '../components/ai/ChatBot.jsx';
import CommandPalette from '../components/common/CommandPalette.jsx';
import api from '../services/api.js';

const MainLayout = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState({});
  const location = useLocation();

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Track global pageView analytics event
  useEffect(() => {
    // Log page view event asynchronously
    api.post('/analytics/event', {
      eventType: 'pageView',
      target: location.pathname + location.hash,
    }).catch(err => console.warn('PageView analytics log failed:', err.message));
  }, [location.pathname, location.hash]);

  // Load settings (social handles, etc) for footer
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.success) {
          setSocialLinks(data.data.socialLinks || {});
        }
      } catch (err) {
        console.warn('Failed to load portfolio setting endpoints:', err.message);
      }
    };
    fetchSettings();
  }, []);

  // Keyboard shortcut Ctrl+K triggers command palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-bgDark flex flex-col">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] aurora-blur-1 pointer-events-none rounded-full" />
      <div className="absolute top-[50%] right-[5%] w-[500px] h-[500px] aurora-blur-2 pointer-events-none rounded-full" />

      {/* HTML5 Canvas Particles Background */}
      <ParticlesCanvas />

      {/* Interactive Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Header onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Core Page Router Viewport */}
      <main className="flex-1 pt-24 pb-12">
        <Outlet />
      </main>

      {/* Co-Pilot AI Chat Assistant */}
      <ChatBot />

      {/* footer */}
      <Footer socialLinks={socialLinks} />
    </div>
  );
};

export default MainLayout;
