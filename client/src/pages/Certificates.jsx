import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Award, ExternalLink, Calendar, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

const Certificates = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedId, setCopiedId] = useState('');

  // Fetch certificates from dynamic API
  const { data: certsRes, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => api.get('/certificates'),
  });

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  // Fallbacks if database is empty
  const defaultCerts = [
    {
      _id: '1',
      title: 'Associate Cloud Engineer',
      organization: 'Google Cloud (Google)',
      issueDate: new Date('2023-10-12'),
      credentialId: 'GCP-ACE-983421',
      credentialUrl: 'https://google.com',
      category: 'Cloud',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    },
    {
      _id: '2',
      title: 'Fundamentals of Deep Learning',
      organization: 'Nvidia Deep Learning Institute',
      issueDate: new Date('2024-02-15'),
      credentialId: 'NVDLI-DL-84291',
      credentialUrl: 'https://nvidia.com',
      category: 'AI & ML',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    },
    {
      _id: '3',
      title: 'Meta Frontend Developer Professional',
      organization: 'Meta / Coursera',
      issueDate: new Date('2023-06-20'),
      credentialId: 'META-FED-73210',
      credentialUrl: 'https://coursera.org',
      category: 'Full Stack',
      image: 'https://images.unsplash.com/photo-1581291518655-9523c932dedf?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const certificates = certsRes?.data?.data?.length > 0 ? certsRes.data.data : defaultCerts;

  const categories = ['All', 'Cloud', 'AI & ML', 'Full Stack', 'DSA'];

  const filteredCerts = activeCategory === 'All'
    ? certificates
    : certificates.filter(c => c.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 mb-10 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-2.5 justify-center sm:justify-start">
          <Award className="w-8 h-8 text-indigo-400" />
          <span>Professional Credentials</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Verified certificates validating technical competencies in cloud engineering, deep learning architectures, and modern web application frameworks.
        </p>
      </div>

      {/* Categories select */}
      <div className="flex flex-wrap gap-2.5 mb-10 justify-center sm:justify-start border-b border-white/5 pb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 clickable ${
              activeCategory === cat
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-500">Loading certificate data...</div>
      ) : filteredCerts.length === 0 ? (
        <div className="py-12 text-center text-xs text-gray-500">No certificates matching this category found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCerts.map((cert) => {
            const issueDateStr = new Date(cert.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
            return (
              <div
                key={cert._id}
                className="group rounded-3xl glass-card border border-white/5 hover:border-white/15 overflow-hidden flex flex-col h-full hover:shadow-glow transition-all duration-300 relative"
              >
                {/* Image */}
                <div className="aspect-video w-full overflow-hidden bg-bgDark border-b border-white/5">
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded uppercase">
                      {cert.category}
                    </span>
                    <h3 className="text-md font-display font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{cert.organization}</p>
                  </div>

                  <div className="text-[10px] text-gray-500 flex flex-col gap-2 mt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Issued: {issueDateStr}
                    </span>
                    
                    {cert.credentialId && (
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        ID: {cert.credentialId}
                        <button
                          onClick={() => handleCopy(cert.credentialId)}
                          className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
                          title="Copy ID"
                        >
                          {copiedId === cert.credentialId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </span>
                    )}
                  </div>

                  {/* Verify Link */}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto pt-4 border-t border-white/5 text-xs text-indigo-400 hover:text-indigo-300 flex items-center justify-between font-bold"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Certificates;
