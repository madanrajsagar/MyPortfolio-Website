import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from './services/api.js';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import Certificates from './pages/Certificates.jsx';
import Gallery from './pages/Gallery.jsx';
import Resume from './pages/Resume.jsx';
import Auth from './pages/Auth.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

const ThemeStyleSetter = () => {
  const { data: settingsRes } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings'),
  });

  const settings = settingsRes?.data?.data || {};

  useEffect(() => {
    const root = document.documentElement;
    if (settings.themeColors) {
      const { primary, secondary, accent } = settings.themeColors;
      if (primary) root.style.setProperty('--color-primary', primary);
      if (secondary) root.style.setProperty('--color-secondary', secondary);
      if (accent) root.style.setProperty('--color-accent', accent);
    }
    if (settings.fonts) {
      const { display, body } = settings.fonts;
      if (display) root.style.setProperty('--font-display', display);
      if (body) root.style.setProperty('--font-body', body);
    }
    if (settings.websiteTitle) {
      document.title = settings.websiteTitle;
    }
  }, [settings]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <ThemeStyleSetter />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="projects/:slug" element={<ProjectDetail />} />
              <Route path="blogs/:slug" element={<BlogDetail />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="resume" element={<Resume />} />
              <Route path="login" element={<Auth />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
