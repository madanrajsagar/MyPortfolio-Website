import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Github, Globe, Eye, Calendar, Sparkles, AlertTriangle, Layers, Lightbulb, Compass, Award } from 'lucide-react';
import api from '../services/api.js';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState('');

  // Fetch project details by unique slug
  const {
    data: projectRes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const { data } = await api.get(`/projects/slug/${slug}`);
      if (data?.data?.gallery?.length > 0) {
        setActiveImage(data.data.heroImage);
      }
      return data.data;
    },
  });

  const handleLinkClick = async (type, url) => {
    try {
      // Log event analytic for project link click
      await api.post('/analytics/event', {
        eventType: 'clickProject',
        target: `${slug}:${type}`,
      });
    } catch (err) {
      console.warn('Analytics event log failed:', err.message);
    }
  };

  const project = projectRes;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4">
        <span className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-gray-500 font-medium">Loading case study details...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[60vh] max-w-xl mx-auto px-6 flex flex-col justify-center items-center text-center gap-6">
        <AlertTriangle className="w-16 h-16 text-rose-500 animate-bounce" />
        <div>
          <h2 className="text-xl font-display font-bold text-white">Project Case Study Not Found</h2>
          <p className="text-xs text-gray-500 mt-2">
            The project URL you requested does not exist or may have been updated.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Back link */}
      <Link
        to="/#projects"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Hero header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Media Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 bg-bgDark relative">
            <img
              src={activeImage || project.heroImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sub-gallery elements preview */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveImage(project.heroImage)}
                className={`w-20 aspect-video rounded-lg overflow-hidden border-2 shrink-0 ${
                  activeImage === project.heroImage || activeImage === ''
                    ? 'border-indigo-500'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={project.heroImage} alt="hero" className="w-full h-full object-cover" />
              </button>
              {project.gallery.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 aspect-video rounded-lg overflow-hidden border-2 shrink-0 ${
                    activeImage === imgUrl ? 'border-indigo-500' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Case study index / metrics */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold px-3 py-1 rounded-full w-max flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3.5 h-3.5 fill-indigo-300" />
              Case Study
            </span>

            <h1 className="text-2xl sm:text-3xl font-display font-black text-white mt-2 leading-tight">
              {project.title}
            </h1>

            <div className="flex gap-4 items-center text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Timeline: {project.timeline || '2024'}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {project.views} views
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
            {project.description}
          </p>

          {/* Action CTAs */}
          <div className="flex gap-3">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick('github', project.githubLink)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center text-xs font-semibold text-white flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick('live', project.liveDemo)}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-center text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-md shadow-indigo-500/10"
              >
                <Globe className="w-4 h-4" />
                <span>Live Deploy</span>
              </a>
            )}
          </div>

          {/* Technical scope grid */}
          <div className="glass-card p-5 rounded-2xl border border-white/5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Core Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs bg-white/5 border border-white/5 px-3.5 py-1 rounded-lg text-gray-300 font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Case Study Details Columns */}
      <div className="mt-16 border-t border-white/5 pt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Side details */}
        <div className="flex flex-col gap-8">
          
          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-indigo-400" />
                <span>Features & Capabilities</span>
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-400 flex flex-col gap-2.5 leading-relaxed">
                {project.features.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Architecture */}
          {project.architecture && project.architecture.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>System Architecture</span>
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-400 flex flex-col gap-2.5 leading-relaxed">
                {project.architecture.map((arch, i) => (
                  <li key={i}>{arch}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Side details */}
        <div className="flex flex-col gap-8">
          
          {/* Challenges & solutions */}
          {project.challenges && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-pink-400" />
                <span>Challenges Faced & Solutions</span>
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                {project.challenges}
              </p>
            </div>
          )}

          {/* Learnings */}
          {project.learnings && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2.5">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span>Engineering Learnings</span>
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                {project.learnings}
              </p>
            </div>
          )}

          {/* Impact */}
          {project.impact && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2.5">
                <Award className="w-5 h-5 text-emerald-400 animate-bounce" />
                <span>Business & Tech Impact</span>
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                {project.impact}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProjectDetail;
