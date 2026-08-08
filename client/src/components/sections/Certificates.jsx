import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Eye, X, ZoomIn, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api.js';

const Certificates = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const { data: certsRes, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => api.get('/certificates'),
  });

  const certificates = (certsRes?.data?.data || []).map(cert => ({
    id: cert._id,
    title: cert.title,
    issuer: cert.organization,
    date: cert.issueDate ? new Date(cert.issueDate).getFullYear().toString() : '',
    image: cert.image,
    category: cert.category,
    credentialId: cert.credentialId || 'N/A',
    credentialUrl: cert.credentialUrl || '',
  }));

  // Duplicate cards for seamless 360 continuous rolling loop
  const displayCertificates = certificates.length > 0
    ? [...certificates, ...certificates, ...certificates, ...certificates]
    : [];

  return (
    <section id="certificates" className="py-24 bg-bgDark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 px-3.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Credentials Portfolio</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Professional <span className="gradient-text text-glow">Certificates</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full mt-4" />
          <p className="mt-4 text-gray-400 text-sm max-w-lg">
            Hover cursor over any card to pause the continuous rolling slider and inspect credentials.
          </p>
        </div>
      </div>

      {/* Wide Bounded Container - Keeps a few pixels distance from screen edge */}
      <div className="w-full max-w-[98%] mx-auto px-2 sm:px-4">
        <div
          className="relative w-full overflow-hidden rounded-3xl p-3 bg-[#080816]/50 border border-white/10 group shadow-2xl backdrop-blur-xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left & Right Gradient Fade Blur Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#080816] via-[#080816]/75 to-transparent z-20 pointer-events-none rounded-l-3xl" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#080816] via-[#080816]/75 to-transparent z-20 pointer-events-none rounded-r-3xl" />

          {/* Rolling Track */}
          <div
            className="flex gap-5 w-max animate-marquee py-2"
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="w-[280px] sm:w-[320px] shrink-0 rounded-2xl overflow-hidden glass-card border border-white/10 p-4 flex flex-col gap-4 animate-pulse">
                  <div className="aspect-video w-full rounded-xl bg-white/5" />
                  <div className="h-4 w-1/2 rounded bg-white/5" />
                  <div className="h-5 w-3/4 rounded bg-white/5" />
                </div>
              ))
            ) : (
              displayCertificates.map((cert, idx) => (
                <div
                  key={`${cert.id}-${idx}`}
                  data-cursor="OPEN"
                  onClick={() => setSelectedCert(cert)}
                  className="w-[320px] sm:w-[400px] shrink-0 rounded-2xl overflow-hidden glass-card border border-white/10 hover:border-indigo-500/50 transition-all duration-300 relative cursor-pointer hover:shadow-glow flex flex-col h-full clickable group/card"
                >
                  {/* Preview image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[#080810] border-b border-white/10">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <div className="px-3 py-2 bg-indigo-600 rounded-xl text-white flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-indigo-500/30">
                        <Eye className="w-4 h-4" />
                        <span>View Credentials</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col gap-2 flex-1 justify-between bg-[#0b0c1e]/60">
                    <div>
                      <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                        {cert.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-display font-bold text-white mt-2 group-hover/card:text-indigo-300 transition-colors leading-tight line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">
                        Issued by: {cert.issuer}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2 text-[9px] text-gray-400 font-semibold">
                      <span>ID: {cert.credentialId}</span>
                      <span className="text-indigo-400 font-bold">{cert.date}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Certificate Zoom Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0b0b14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                    {selectedCert.category}
                  </span>
                  <h3 className="text-base font-display font-bold text-white mt-1.5">{selectedCert.title}</h3>
                  <p className="text-xs text-gray-500">Credential ID: {selectedCert.credentialId} • Issued by {selectedCert.issuer}</p>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body / Image */}
              <div className="p-6 flex justify-center items-center bg-black/40 relative group/zoom">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  className="max-h-[60vh] object-contain rounded-xl shadow-lg border border-white/5 cursor-zoom-in"
                />
                {/* Zoom Hint */}
                <div className="absolute top-8 right-8 p-1.5 bg-black/50 rounded-lg opacity-0 group-hover/zoom:opacity-100 transition-opacity pointer-events-none">
                  <ZoomIn className="w-4 h-4 text-white/70" />
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-white/5 flex items-center justify-between gap-3">
                {selectedCert.credentialUrl ? (
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : <div />}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
