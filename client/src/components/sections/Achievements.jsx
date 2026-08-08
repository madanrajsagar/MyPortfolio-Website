import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, X, ChevronLeft, ChevronRight, ZoomIn, Award, Star, Medal } from 'lucide-react';

// ──────────────────────────────────────────────
// Image Carousel Component
// ──────────────────────────────────────────────
const ImageCarousel = ({ images, onZoom }) => {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const total = images?.length ?? 0;

  const prev = (e) => {
    e?.stopPropagation();
    setCurrent(c => (c - 1 + total) % total);
  };
  const next = (e) => {
    e?.stopPropagation();
    setCurrent(c => (c + 1) % total);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next(e) : prev(e);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!total) return null;

  return (
    <div
      className="w-full rounded-xl border border-white/10 bg-black select-none"
      style={{ position: 'relative' }}
    >
      {/*
        ── Viewport: clips the sliding track ──────────────────────
        overflow:hidden on this element, NOT the aspect-ratio wrapper,
        so the padding-top trick works correctly.
        ─────────────────────────────────────────────────────────── */}
      <div
        style={{ overflow: 'hidden', position: 'relative' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/*
          ── Aspect-ratio spacer (16:9) ─────────────────────────
          padding-top derives height from the element's own width.
          The sliding track is positioned over this spacer.
          ────────────────────────────────────────────────────── */}
        <div style={{ paddingTop: '56.25%', position: 'relative' }}>
          {/*
            ── Sliding track ─────────────────────────────────────
            Sits absolute over the spacer. Width = total * 100% of
            the CONTAINER (not of itself), so each slide gets the
            full container width. translateX moves by multiples of
            containerWidth (i.e. 1/total of track width).
            ────────────────────────────────────────────────────── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              width: `${total * 100}%`,
              transform: `translateX(-${(current / total) * 100}%)`,
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {images.map((src, i) => (
              <div
                key={i}
                style={{
                  width: `${100 / total}%`,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#000',
                  height: '100%',
                }}
              >
                <img
                  src={src}
                  alt={`Photo ${i + 1} of ${total}`}
                  draggable={false}
                  onClick={() => i === current && onZoom && onZoom(src)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    cursor: 'zoom-in',
                    display: 'block',
                  }}
                />
              </div>
            ))}
          </div>

          {/* ── Counter badge (top-left) ─────────────────────── */}
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 10,
              background: 'rgba(0,0,0,0.70)',
              padding: '2px 10px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.03em',
            }}
          >
            {current + 1} / {total}
          </div>

          {/* ── Zoom hint (top-right) ────────────────────────── */}
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 10,
              background: 'rgba(0,0,0,0.55)',
              padding: 6,
              borderRadius: 8,
              pointerEvents: 'none',
            }}
          >
            <ZoomIn style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.7)' }} />
          </div>

          {/* ── Prev / Next arrows ───────────────────────────── */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                style={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.72)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  transition: 'background 0.15s',
                }}
              >
                <ChevronLeft style={{ width: 20, height: 20 }} />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.72)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  transition: 'background 0.15s',
                }}
              >
                <ChevronRight style={{ width: 20, height: 20 }} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Dot indicators (below the image) ────────────────────── */}
      {total > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '8px 0',
            background: 'rgba(0,0,0,0.45)',
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              aria-label={`Go to image ${i + 1}`}
              style={{
                width: i === current ? 20 : 8,
                height: 8,
                borderRadius: 999,
                background: i === current ? '#ffffff' : 'rgba(255,255,255,0.35)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};


// ──────────────────────────────────────────────
// Lightbox Component
// ──────────────────────────────────────────────
const Lightbox = ({ src, onClose }) => {
  useEffect(() => {
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
        onClick={(e) => e.stopPropagation()}
      />
      <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" onClick={onClose}>
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};

// ──────────────────────────────────────────────
// Map a DB achievement record to the UI shape
// ──────────────────────────────────────────────
const mapAchievement = (a) => ({
  id: a._id,
  title: a.title,
  position: a.position || '',
  positionLabel: a.positionLabel || '',
  category: a.category || '',
  badge: a.badge || 'gold',
  date: a.date || '',
  description: a.description || '',
  technologies: a.technologies || [],
  contribution: a.contribution || '',
  images: Array.from(new Set([
    ...(a.photos || []),
    ...(a.gallery || []),
    ...(a.images || []),
    ...(a.localImages || [])
  ])).filter(Boolean),
});





// ──────────────────────────────────────────────
// Badge colors
// ──────────────────────────────────────────────
const badgeConfig = {
  gold: { border: 'border-amber-500/30', glow: 'shadow-amber-500/10', accent: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/20 text-amber-300' },
  platinum: { border: 'border-violet-500/30', glow: 'shadow-violet-500/10', accent: 'text-violet-400', badge: 'bg-violet-500/10 border-violet-500/20 text-violet-300' },
  silver: { border: 'border-gray-400/30', glow: 'shadow-gray-400/10', accent: 'text-gray-300', badge: 'bg-gray-500/10 border-gray-500/20 text-gray-300' },
  bronze: { border: 'border-orange-500/30', glow: 'shadow-orange-500/10', accent: 'text-orange-400', badge: 'bg-orange-500/10 border-orange-500/20 text-orange-300' },
};

// ──────────────────────────────────────────────
// Achievement Card
// ──────────────────────────────────────────────
const AchievementCard = ({ item, onClick }) => {
  const bc = badgeConfig[item.badge] || badgeConfig.gold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5 }}
      data-cursor="OPEN"
      onClick={() => onClick(item)}
      className={`achievement-card p-5 rounded-2xl glass-card border ${bc.border} hover:shadow-lg ${bc.glow} transition-all duration-300 flex flex-col gap-4 cursor-pointer clickable group relative overflow-hidden`}
    >
      {/* Top glow accent line is added by CSS .achievement-card::before */}
      
      {/* Cover image */}
      {item.images && item.images.length > 0 && (
        <div className="relative h-40 rounded-xl overflow-hidden border border-white/5 bg-[#080810] clip-reveal-container">
          <motion.img
            initial={{ scale: 1.05 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b14]/80 to-transparent group-hover:opacity-40 transition-all duration-300" />
          {/* Image count badge */}
          {item.images.length > 1 && (
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-[8px] text-white/70 font-semibold flex items-center gap-1 z-10">
              📷 {item.images.length} photos
            </div>
          )}
        </div>
      )}

      {/* Category & date */}
      <div className="flex items-center justify-between">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${bc.badge}`}>
          {item.category}
        </span>
        <span className="text-[9px] text-gray-600 font-semibold">{item.date}</span>
      </div>

      {/* Position badge */}
      <div>
        <div className={`text-xs font-black ${bc.accent} mb-1`}>{item.position}</div>
        <h3 className="text-sm font-display font-bold text-white leading-snug group-hover:text-indigo-200 transition-colors line-clamp-2">
          {item.title}
        </h3>
      </div>

      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>

      {/* Tech chips */}
      {item.technologies && item.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.technologies.slice(0, 3).map(t => (
            <span key={t} className="text-[8px] bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-gray-400 uppercase tracking-wide font-medium">{t}</span>
          ))}
          {item.technologies.length > 3 && (
            <span className="text-[8px] text-gray-600 font-semibold px-1">+{item.technologies.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
        <span className="text-[9px] text-gray-600 font-semibold">{item.positionLabel}</span>
        <span className={`text-[9px] font-bold ${bc.accent} flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200`}>
          View Details →
        </span>
      </div>
    </motion.div>
  );
};

// ──────────────────────────────────────────────
// Main Achievements Section
// ──────────────────────────────────────────────
// Loading skeleton card
const AchievementSkeleton = () => (
  <div className="p-5 rounded-2xl glass-card border border-white/5 flex flex-col gap-4 animate-pulse">
    <div className="h-40 rounded-xl bg-white/5" />
    <div className="flex justify-between">
      <div className="h-4 w-24 rounded bg-white/5" />
      <div className="h-4 w-10 rounded bg-white/5" />
    </div>
    <div className="h-4 w-3/4 rounded bg-white/5" />
    <div className="h-3 w-full rounded bg-white/5" />
    <div className="h-3 w-5/6 rounded bg-white/5" />
  </div>
);

const Achievements = ({ achievements = [], isLoading = false }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  // Map DB records to UI shape
  const achievementRecords = achievements.map(mapAchievement);

  const featured = achievementRecords.slice(0, 3);
  const rest = achievementRecords.slice(3);

  return (
    <section id="achievements" className="py-24 bg-[#030307] relative overflow-hidden">
      <div className="absolute top-[5%] right-[5%] w-[300px] h-[300px] aurora-blur-2 pointer-events-none rounded-full opacity-50" />
      <div className="absolute bottom-[5%] left-[5%] w-[250px] h-[250px] aurora-blur-1 pointer-events-none rounded-full opacity-40" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Honors & Milestones</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Key <span className="gradient-text text-glow">Achievements</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-4" />
          <p className="mt-4 text-gray-500 text-sm max-w-xl">
            9 achievements across hackathons, academic excellence, AI competitions, and open source contributions.
          </p>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1,2,3].map(i => <AchievementSkeleton key={i} />)}
          </div>
        )}

        {/* Top 3 featured */}
        {!isLoading && featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featured.map(item => (
              <AchievementCard key={item.id} item={item} onClick={setSelectedItem} />
            ))}
          </div>
        )}

        {/* Divider */}
        {!isLoading && rest.length > 0 && (
          <div className="flex items-center gap-4 my-10 opacity-40">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest whitespace-nowrap">More Achievements</span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-white/10" />
          </div>
        )}

        {/* Remaining */}
        {!isLoading && rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map(item => (
              <AchievementCard key={item.id} item={item} onClick={setSelectedItem} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && achievementRecords.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No achievements yet. Check back soon!</p>
          </div>
        )}

        {/* ──── Detail Modal ──── */}
        <AnimatePresence>
          {selectedItem && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl bg-[#0b0b14] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-2xl flex flex-col"
                style={{ maxHeight: 'min(90vh, 700px)', height: 'auto' }}
                onClick={e => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className={`achievement-card p-6 border-b border-white/5 flex items-start justify-between gap-4`}>
                  <div className="flex flex-col gap-1">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${(badgeConfig[selectedItem.badge] || badgeConfig.gold).badge} px-2 py-0.5 rounded-full border w-fit`}>
                      {selectedItem.category}
                    </span>
                    <div className={`text-sm font-black ${(badgeConfig[selectedItem.badge] || badgeConfig.gold).accent}`}>
                      {selectedItem.position} · {selectedItem.date}
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white leading-tight">{selectedItem.title}</h3>
                    <p className="text-xs text-gray-400">{selectedItem.positionLabel}</p>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal body - scrollable */}
                <div className="overflow-y-auto flex-1 p-4 sm:p-6 flex flex-col gap-5">
                  {/* Image carousel — DB stores in 'photos', mapped to 'images' */}
                  {selectedItem.images && selectedItem.images.length > 0 && (
                    <ImageCarousel images={selectedItem.images} onZoom={setLightboxSrc} />
                  )}

                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Overview</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedItem.description}</p>
                  </div>

                  {/* My Contribution */}
                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5" /> My Contribution
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{selectedItem.contribution}</p>
                  </div>

                  {/* Highlights */}
                  {selectedItem.highlights && selectedItem.highlights.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Event Highlights</h4>
                      <ul className="flex flex-col gap-2">
                        {selectedItem.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="text-amber-400 mt-0.5">✦</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies */}
                  {selectedItem.technologies && selectedItem.technologies.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Technologies / Skills Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.technologies.map(t => (
                          <span key={t} className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ──── Lightbox ──── */}
        <AnimatePresence>
          {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Achievements;
