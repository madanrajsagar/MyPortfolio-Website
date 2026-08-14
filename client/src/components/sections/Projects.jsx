import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, ArrowUpRight, Github, X, ChevronLeft, ChevronRight, ZoomIn, Layers, Clock, CheckCircle, AlertTriangle, Lightbulb, Star, ExternalLink, Smartphone, Code2 } from 'lucide-react';

// ──────────────────────────────────────────────
// Image Carousel Component (reusable)
// ──────────────────────────────────────────────
const ImageCarousel = ({ images, onZoom, aspectClass = 'aspect-video' }) => {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);

  const prev = (e) => { e?.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length); };
  const next = (e) => { e?.stopPropagation(); setCurrent(c => (c + 1) % images.length); };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) { delta < 0 ? next() : prev(); }
    touchStartX.current = null;
  };

  if (!images || images.length === 0) return (
    <div className={`${aspectClass} w-full bg-white/3 rounded-xl flex items-center justify-center border border-white/5`}>
      <span className="text-gray-600 text-sm">No preview available</span>
    </div>
  );

  return (
    <div
      className={`relative ${aspectClass} rounded-xl overflow-hidden border border-white/10 group/carousel`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          src={images[current]}
          alt={`Screenshot ${current + 1}`}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={() => onZoom && onZoom(images[current])}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      <div className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity pointer-events-none">
        <ZoomIn className="w-3.5 h-3.5 text-white/70" />
      </div>
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-white opacity-0 group-hover/carousel:opacity-100 transition-all border border-white/10">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-white opacity-0 group-hover/carousel:opacity-100 transition-all border border-white/10">
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }} className={`rounded-full transition-all duration-200 ${i === current ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'}`} />
            ))}
          </div>
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded-full text-[9px] text-white/70 font-semibold">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

// Lightbox
const Lightbox = ({ src, onClose }) => {
  React.useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <motion.img
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        src={src}
        alt="Zoomed"
        className="lightbox-image"
        onClick={e => e.stopPropagation()}
      />
      <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white" onClick={onClose}>
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};

// Loading skeleton for Projects
const ProjectSkeleton = () => (
  <div className="rounded-3xl glass-card border border-white/5 overflow-hidden flex flex-col h-full animate-pulse p-6 gap-4">
    <div className="aspect-video w-full rounded-2xl bg-white/5" />
    <div className="h-4 w-1/3 rounded bg-white/5" />
    <div className="h-6 w-3/4 rounded bg-white/5" />
    <div className="h-4 w-full rounded bg-white/5" />
    <div className="h-4 w-5/6 rounded bg-white/5" />
    <div className="h-8 w-1/3 rounded bg-white/5 mt-auto" />
  </div>
);

// ──────────────────────────────────────────────
// Project Card (collapsed view)
// ──────────────────────────────────────────────
const ProjectCard = ({ project, onOpen }) => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -6 }}
    data-cursor="VIEW"
    onClick={() => onOpen(project)}
    className="group rounded-3xl glass-card border border-purple-500/15 hover:border-purple-500/35 overflow-hidden flex flex-col h-full relative hover:shadow-glow transition-all duration-300 clickable cursor-pointer"
  >
    {/* Hero image / placeholder */}
    <div className="relative aspect-video w-full overflow-hidden bg-[#080810] clip-reveal-container">
      {project.featured && (
        <span className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 border border-amber-300 text-black font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
          ⭐ Featured
        </span>
      )}
      <span className="absolute top-3 right-3 z-10 text-[9px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 backdrop-blur-md">
        {project.status}
      </span>
      {project.images && project.images.length > 0 ? (
        <motion.img
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-white/5">
          <Code2 className="w-10 h-10 text-purple-400 opacity-40" />
        </div>
      )}
    </div>

    {/* Content Body */}
    <div className="p-6 flex flex-col gap-4 flex-1">
      <div>
        <span className="text-[9px] text-purple-300 font-bold uppercase tracking-wider bg-purple-500/15 border border-purple-500/25 px-2.5 py-0.5 rounded-full">
          {project.category}
        </span>
        <h3 className="text-lg font-display font-bold text-white mt-2 group-hover:text-purple-300 transition-colors leading-tight">
          {project.title}
        </h3>
      </div>

      <p className="text-xs text-gray-300 font-normal line-clamp-3 leading-relaxed">
        {project.shortDescription || project.description || project.overview || project.tagline}
      </p>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {(project.technologies || []).slice(0, 4).map((tech, idx) => (
          <span key={idx} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-300 font-medium">
            {tech}
          </span>
        ))}
        {project.technologies && project.technologies.length > 4 && (
          <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full text-purple-300 font-bold">
            +{project.technologies.length - 4}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(project); }}
          className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white font-bold transition-colors clickable group/btn"
        >
          <span>View Case Study</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
        </button>
        <div className="flex gap-2">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all" onClick={e => e.stopPropagation()}>
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {project.liveDemo && (
            <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-blue-400 hover:text-blue-300 hover:border-blue-500/30 transition-all" onClick={e => e.stopPropagation()}>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

// ──────────────────────────────────────────────
// Case Study Modal
// ──────────────────────────────────────────────
const CaseStudyModal = ({ project, onClose }) => {
  const [lightboxSrc, setLightboxSrc] = useState(null);

  React.useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') { if (lightboxSrc) setLightboxSrc(null); else onClose(); } };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, lightboxSrc]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl bg-[#0b0b14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-white/5 flex items-start justify-between gap-4 bg-gradient-to-r from-indigo-500/5 to-transparent">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">{project.category}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{project.status}</span>
                {project.responsive && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Smartphone className="w-2.5 h-2.5" /> Responsive
                  </span>
                )}
              </div>
              <h3 className="text-xl font-display font-black text-white">{project.title}</h3>
              <p className="text-sm text-indigo-400/80 font-semibold mt-0.5">{project.tagline}</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Duration: {project.duration}
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-8">

            {/* Image Carousel */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Screenshots & Demo</h4>
              <ImageCarousel images={project.images} onZoom={setLightboxSrc} />
            </div>

            {/* Overview */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Overview</h4>
              <p className="text-sm text-gray-300 leading-relaxed">{project.overview}</p>
            </div>

            {/* Problem / Solution Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Problem
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">{project.problem}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Solution
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">{project.solution}</p>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Key Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-medium">{tech}</span>
                ))}
              </div>
            </div>

            {/* Architecture */}
            {project.architecture && project.architecture.length > 0 && (
              <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
                <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Architecture
                </h4>
                <div className="flex flex-col gap-1.5 text-sm text-gray-400">
                  {project.architecture.map((line, idx) => (
                    <p key={idx} className="leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges */}
            {project.challenges && project.challenges.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Challenges Faced</h4>
                <ul className="flex flex-col gap-2">
                  {project.challenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-amber-400 mt-0.5">⚡</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* My Contribution */}
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5" /> My Contribution
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">{project.contribution}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold text-sm transition-all">
                  <Github className="w-4 h-4" /> View on GitHub
                </a>
              )}
              {project.liveDemo && (
                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
      </AnimatePresence>
    </>
  );
};

// ──────────────────────────────────────────────
// Main Projects Section
// ──────────────────────────────────────────────
const Projects = ({ projects = [], isLoading = false }) => {
  const [openProject, setOpenProject] = useState(null);

  // Map dynamic backend records
  const projectRecords = projects.map(p => {
    const getFormattedUrl = (url) => {
      if (!url) return '';
      if (typeof url === 'string' && url.startsWith('http://localhost:5000/')) {
        const apiBase = import.meta.env.VITE_API_URL.replace('/api', '');
        return url.replace('http://localhost:5000', apiBase);
      }
      return url;
    };

    const rawImages = [
      ...(p.heroImage ? [p.heroImage] : []),
      ...(p.gallery || []),
      ...(p.images || []),
      ...(p.localImages || [])
    ];
    const imagesList = Array.from(new Set(rawImages.map(getFormattedUrl))).filter(Boolean);

    return {
      id: p._id,
      title: p.title,
      tagline: p.tagline || '',
      category: p.category || 'Full Stack',
      duration: p.duration || p.timeline || '',
      status: p.projectStatus || (p.status === 'published' ? 'Live' : 'Completed'),
      featured: p.featured,
      images: imagesList,
      description: p.description || p.shortDescription || p.tagline || '',
      shortDescription: p.description || p.shortDescription || p.tagline || '',
      overview: p.longDescription || p.description,
      problem: p.problem || '',
      solution: p.solution || '',
      features: p.features || [],
      techStack: p.techStack || [],
      technologies: p.techStack || p.technologies || [],
      architecture: p.architecture || [],
      challenges: p.challenges ? (Array.isArray(p.challenges) ? p.challenges : [p.challenges]) : [],
      contribution: p.contribution || 'Developer',
      githubLink: p.githubLink || '',
      liveDemo: p.liveDemo || '',
      responsive: p.responsive ?? true
    };
  });

  return (
    <section id="projects" className="py-24 bg-bgDark relative overflow-hidden">
      <div className="absolute top-[10%] left-[-5%] w-[300px] h-[300px] aurora-blur-1 pointer-events-none rounded-full opacity-40" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Development Showcase</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Engineering <span className="gradient-text text-glow">Projects</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full mt-4" />
          <p className="mt-4 text-gray-500 text-sm max-w-lg">
            4 full-stack applications built from scratch — each a complete case study with real problem statements, solutions, and technical depth.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <ProjectSkeleton key={idx} />
            ))
          ) : projectRecords.length === 0 ? (
            <div className="col-span-2 text-center py-20 text-gray-600">
              <FolderGit2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No engineering projects found. Check back soon!</p>
            </div>
          ) : (
            projectRecords.map(project => (
              <ProjectCard key={project.id} project={project} onOpen={setOpenProject} />
            ))
          )}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">More projects and experiments on GitHub</p>
          <a
            href="https://github.com/madanrajsagar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold text-sm transition-all"
          >
            <Github className="w-4 h-4" />
            View All on GitHub
            <ArrowUpRight className="w-4 h-4 text-indigo-400" />
          </a>
        </motion.div>

      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {openProject && <CaseStudyModal project={openProject} onClose={() => setOpenProject(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
