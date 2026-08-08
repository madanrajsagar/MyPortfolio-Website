import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Hero from '../components/sections/Hero.jsx';
import Highlights from '../components/sections/Highlights.jsx';
import About from '../components/sections/About.jsx';
import Skills from '../components/sections/Skills.jsx';
import Projects from '../components/sections/Projects.jsx';
import Achievements from '../components/sections/Achievements.jsx';
import Experience from '../components/sections/Experience.jsx';
import CodingProfiles from '../components/sections/CodingProfiles.jsx';
import Certificates from '../components/sections/Certificates.jsx';
import Testimonials from '../components/sections/Testimonials.jsx';
import Contact from '../components/sections/Contact.jsx';
import api from '../services/api.js';

const Home = () => {
  const location = useLocation();

  // Scroll to section based on navigation trigger states
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location]);

  // Parallel React Query fetch hooks
  const { data: settingsRes } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings'),
  });

  const { data: projectsRes, isLoading: projectsLoading } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: () => api.get('/projects?featured=true'),
  });

  const { data: skillsRes, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => api.get('/skills'),
  });

  const { data: experiencesRes, isLoading: experiencesLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => api.get('/experience'),
  });

  const { data: educationsRes, isLoading: educationsLoading } = useQuery({
    queryKey: ['educations'],
    queryFn: () => api.get('/education'),
  });

  const { data: achievementsRes, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => api.get('/achievements'),
  });

  const settings = settingsRes?.data?.data || {};
  const projects = projectsRes?.data?.data || [];
  const skills = skillsRes?.data?.data || [];
  const experiences = experiencesRes?.data?.data || [];
  const educations = educationsRes?.data?.data || [];
  const achievements = achievementsRes?.data?.data || [];

  const visibility = settings.sectionVisibility || {};

  return (
    <div className="flex flex-col">
      {visibility.hero !== false && <Hero settings={settings} />}
      <Highlights />
      {visibility.about !== false && <About education={educations} aboutMe={settings.aboutMe} isLoading={educationsLoading} />}
      {visibility.achievements !== false && <Achievements achievements={achievements} isLoading={achievementsLoading} />}
      {visibility.projects !== false && <Projects projects={projects} isLoading={projectsLoading} />}
      {visibility.skills !== false && <Skills skills={skills} isLoading={skillsLoading} />}
      {visibility.experience !== false && <Experience experiences={experiences} isLoading={experiencesLoading} />}
      <Testimonials />
      <CodingProfiles />
      <Certificates />
      {visibility.contact !== false && <Contact settings={settings} />}
    </div>
  );
};

export default Home;
