import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Upload, Eye, FileText, Settings, Sparkles, Layout, Palette, Phone, Heart, Check, AlertCircle } from 'lucide-react';
import api from '../../services/api.js';

const SettingsManager = () => {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // File input refs
  const logoFileRef = useRef(null);
  const faviconFileRef = useRef(null);
  const heroImageFileRef = useRef(null);
  const resumeFileRef = useRef(null);

  // Fetch settings
  const { data: settingsRes, isLoading } = useQuery({
    queryKey: ['admin-settings-manager'],
    queryFn: () => api.get('/settings'),
  });

  const settings = settingsRes?.data?.data || {};

  // Form states
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData({
        websiteTitle: settings.websiteTitle || '',
        websiteDescription: settings.websiteDescription || '',
        themeColors: settings.themeColors || { primary: '#6366f1', secondary: '#ec4899', accent: '#8b5cf6' },
        fonts: settings.fonts || { display: 'Space Grotesk', body: 'Inter' },
        sectionVisibility: settings.sectionVisibility || {
          hero: true, about: true, skills: true, projects: true,
          experience: true, achievements: true, blogs: true, contact: true
        },
        homeHero: {
          title: settings.homeHero?.title || '',
          name: settings.homeHero?.name || '',
          subtitle: settings.homeHero?.subtitle || '',
          description: settings.homeHero?.description || '',
          ctaText: settings.homeHero?.ctaText || '',
          profileImage: settings.homeHero?.profileImage || '',
          typingText: settings.homeHero?.typingText?.join(', ') || ''
        },
        aboutMe: settings.aboutMe || { mission: '', vision: '', values: '' },
        contactDetails: settings.contactDetails || { email: '', address: '', googleMapIframe: '' },
        socialLinks: settings.socialLinks || { github: '', linkedin: '', leetcode: '', codechef: '', gfg: '', email: '' },
        footerText: settings.footerText || '',
        copyrightText: settings.copyrightText || '',
        aiAssistantPrompt: settings.aiAssistantPrompt || ''
      });
    }
  }, [settings]);

  const handleTextChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parentField, key, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [key]: value
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    const data = new FormData();

    // Serialize object fields
    data.append('websiteTitle', formData.websiteTitle);
    data.append('websiteDescription', formData.websiteDescription);
    data.append('themeColors', JSON.stringify(formData.themeColors));
    data.append('fonts', JSON.stringify(formData.fonts));
    data.append('sectionVisibility', JSON.stringify(formData.sectionVisibility));
    
    // Safe typing text parsing
    let typingTextArray = [];
    if (formData.homeHero?.typingText) {
      if (Array.isArray(formData.homeHero.typingText)) {
        typingTextArray = formData.homeHero.typingText;
      } else if (typeof formData.homeHero.typingText === 'string') {
        typingTextArray = formData.homeHero.typingText.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const heroPayload = {
      ...formData.homeHero,
      typingText: typingTextArray
    };
    data.append('homeHero', JSON.stringify(heroPayload));
    
    data.append('aboutMe', JSON.stringify(formData.aboutMe));
    data.append('contactDetails', JSON.stringify(formData.contactDetails));
    data.append('socialLinks', JSON.stringify(formData.socialLinks));
    data.append('footerText', formData.footerText);
    data.append('copyrightText', formData.copyrightText);
    data.append('aiAssistantPrompt', formData.aiAssistantPrompt);

    // Append file inputs if selected
    if (logoFileRef.current?.files[0]) {
      data.append('logoFile', logoFileRef.current.files[0]);
    }
    if (faviconFileRef.current?.files[0]) {
      data.append('faviconFile', faviconFileRef.current.files[0]);
    }
    if (heroImageFileRef.current?.files[0]) {
      data.append('profileImageFile', heroImageFileRef.current.files[0]);
    }

    try {
      const res = await api.put('/settings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        setSuccess('All portfolio layout settings updated successfully!');
        queryClient.invalidateQueries(['admin-settings-manager']);
        queryClient.invalidateQueries(['settings']);
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Settings update failed.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);

    const data = new FormData();
    data.append('file', file);

    try {
      const uploadRes = await api.post('/media/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (uploadRes.data?.success) {
        const fileUrl = uploadRes.data?.data?.url || uploadRes.data?.data?.mediaUrl;
        if (!fileUrl) {
          throw new Error('Upload succeeded but no CDN URL returned.');
        }

        // Update homeHero profile image locally
        setFormData(prev => ({
          ...prev,
          homeHero: { ...prev.homeHero, profileImage: fileUrl }
        }));

        let helperTextArray = [];
        if (formData.homeHero?.typingText) {
          if (Array.isArray(formData.homeHero.typingText)) {
            helperTextArray = formData.homeHero.typingText;
          } else if (typeof formData.homeHero.typingText === 'string') {
            helperTextArray = formData.homeHero.typingText.split(',').map(s => s.trim()).filter(Boolean);
          }
        }

        const directPayload = {
          homeHero: {
            ...formData.homeHero,
            typingText: helperTextArray,
            profileImage: fileUrl
          }
        };
        await api.put('/settings', directPayload);
        setSuccess('Hero profile image uploaded and saved to Cloudinary!');
        queryClient.invalidateQueries(['admin-settings-manager']);
        queryClient.invalidateQueries(['settings']);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to upload hero photo: ' + (err.response?.data?.message || err.message));
      setTimeout(() => setError(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('resume', file);

    try {
      const res = await api.post('/settings/resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        setSuccess('New Resume CV PDF uploaded successfully!');
        queryClient.invalidateQueries(['admin-settings-manager']);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload Resume PDF.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || Object.keys(formData).length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">Config Settings & Layouts</h2>
          <p className="text-xs text-gray-500 mt-1">Manage brand branding, landing sections visibility, typography, color themes, and chatbot behaviors.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-500/10 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. BRANDING SECTION */}
      <div className="p-6 rounded-3xl bg-[#0c0c16]/50 border border-white/5 flex flex-col gap-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Website Branding & Metadata</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Website Header Title</label>
            <input
              type="text"
              value={formData.websiteTitle}
              onChange={(e) => handleTextChange('websiteTitle', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">SEO Meta Description</label>
            <input
              type="text"
              value={formData.websiteDescription}
              onChange={(e) => handleTextChange('websiteDescription', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
          {/* Logo upload */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Custom Brand Logo Image</label>
            <div className="flex items-center gap-4">
              {settings.logo && (
                <img src={settings.logo} alt="Current logo" className="h-10 w-10 object-contain rounded bg-bgDark border border-white/10" />
              )}
              <input
                type="file"
                ref={logoFileRef}
                accept="image/*"
                className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-white/5 file:text-white file:cursor-pointer hover:file:bg-white/10"
              />
            </div>
          </div>

          {/* Favicon upload */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Site Favicon File</label>
            <div className="flex items-center gap-4">
              {settings.favicon && (
                <img src={settings.favicon} alt="Favicon" className="h-6 w-6 object-contain" />
              )}
              <input
                type="file"
                ref={faviconFileRef}
                accept="image/*"
                className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-white/5 file:text-white file:cursor-pointer hover:file:bg-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION VISIBILITY */}
      <div className="p-6 rounded-3xl bg-[#0c0c16]/50 border border-white/5 flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Layout className="w-4 h-4 text-pink-400" />
          <span>Homepage Sections Visibility</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.keys(formData.sectionVisibility).map((section) => (
            <label key={section} className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:border-white/10 transition-all select-none">
              <span className="text-xs font-semibold text-white capitalize">{section}</span>
              <input
                type="checkbox"
                checked={formData.sectionVisibility[section]}
                onChange={(e) => handleNestedChange('sectionVisibility', section, e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-white/10 bg-bgDark cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>

      {/* 3. HERO SETTINGS */}
      <div className="p-6 rounded-3xl bg-[#0c0c16]/50 border border-white/5 flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Hero Banner Content</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Welcome Subtitle</label>
            <input
              type="text"
              value={formData.homeHero.title}
              onChange={(e) => handleNestedChange('homeHero', 'title', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Display Name</label>
            <input
              type="text"
              value={formData.homeHero.name}
              onChange={(e) => handleNestedChange('homeHero', 'name', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">CTA Button Label</label>
            <input
              type="text"
              value={formData.homeHero.ctaText}
              onChange={(e) => handleNestedChange('homeHero', 'ctaText', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase text-gray-400 font-bold">Typing Roles (Comma Separated)</label>
          <input
            type="text"
            placeholder="AI Engineer, Full-Stack Developer, Competitive Programmer"
            value={formData.homeHero.typingText}
            onChange={(e) => handleNestedChange('homeHero', 'typingText', e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase text-gray-400 font-bold">Intro Paragraph Description</label>
          <textarea
            rows="3"
            value={formData.homeHero.description}
            onChange={(e) => handleNestedChange('homeHero', 'description', e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Hero Photo upload */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-[10px] uppercase text-gray-400 font-bold">Hero Profile Photo / Illustration</label>
          <div className="flex items-center gap-4">
            {settings.homeHero?.profileImage && (
              <img src={settings.homeHero.profileImage} alt="Hero avatar" className="h-14 w-14 object-cover rounded-xl border border-white/10" />
            )}
            <input
              ref={heroImageFileRef}
              type="file"
              onChange={handleHeroImageUpload}
              accept="image/*"
              className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-white/5 file:text-white file:cursor-pointer hover:file:bg-white/10"
            />
          </div>
        </div>
      </div>

      {/* 4. ABOUT ME SETTINGS */}
      <div className="p-6 rounded-3xl bg-[#0c0c16]/50 border border-white/5 flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>About Me Columns</span>
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Mission Statement</label>
            <textarea
              rows="2"
              value={formData.aboutMe.mission}
              onChange={(e) => handleNestedChange('aboutMe', 'mission', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500 resize-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Vision Statement</label>
            <textarea
              rows="2"
              value={formData.aboutMe.vision}
              onChange={(e) => handleNestedChange('aboutMe', 'vision', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500 resize-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Core Engineering Values</label>
            <textarea
              rows="2"
              value={formData.aboutMe.values}
              onChange={(e) => handleNestedChange('aboutMe', 'values', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* 5. COLOR PALETTES & FONTS */}
      <div className="p-6 rounded-3xl bg-[#0c0c16]/50 border border-white/5 flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Palette className="w-4 h-4 text-indigo-400" />
          <span>Visual Theme Styles & Colors</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Primary Theme Color (Accent Indigo)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.themeColors.primary}
                onChange={(e) => handleNestedChange('themeColors', 'primary', e.target.value)}
                className="w-8 h-8 rounded border border-white/10 bg-bgDark cursor-pointer"
              />
              <input
                type="text"
                value={formData.themeColors.primary}
                onChange={(e) => handleNestedChange('themeColors', 'primary', e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none uppercase"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Secondary Color (Accent Pink)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.themeColors.secondary}
                onChange={(e) => handleNestedChange('themeColors', 'secondary', e.target.value)}
                className="w-8 h-8 rounded border border-white/10 bg-bgDark cursor-pointer"
              />
              <input
                type="text"
                value={formData.themeColors.secondary}
                onChange={(e) => handleNestedChange('themeColors', 'secondary', e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none uppercase"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Accent Color (Accent Purple)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.themeColors.accent}
                onChange={(e) => handleNestedChange('themeColors', 'accent', e.target.value)}
                className="w-8 h-8 rounded border border-white/10 bg-bgDark cursor-pointer"
              />
              <input
                type="text"
                value={formData.themeColors.accent}
                onChange={(e) => handleNestedChange('themeColors', 'accent', e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none uppercase"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Display Font Family (CSS Font)</label>
            <input
              type="text"
              placeholder="Space Grotesk, Syne, Outfit, Montserrat"
              value={formData.fonts.display}
              onChange={(e) => handleNestedChange('fonts', 'display', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Body/Paragraph Font Family</label>
            <input
              type="text"
              placeholder="Inter, Roboto, Open Sans"
              value={formData.fonts.body}
              onChange={(e) => handleNestedChange('fonts', 'body', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none"
            />
          </div>
        </div>
      </div>

      {/* 6. CONTACT DETAILS */}
      <div className="p-6 rounded-3xl bg-[#0c0c16]/50 border border-white/5 flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Phone className="w-4 h-4 text-pink-400" />
          <span>Contact Card Details</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Contact Email</label>
            <input
              type="email"
              value={formData.contactDetails.email}
              onChange={(e) => handleNestedChange('contactDetails', 'email', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Office/Location Address</label>
            <input
              type="text"
              value={formData.contactDetails.address}
              onChange={(e) => handleNestedChange('contactDetails', 'address', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase text-gray-400 font-bold">Google Maps Embed Link / Iframe Tag</label>
          <textarea
            rows="2"
            placeholder="Paste raw Google Maps iframe embed tag or source URL"
            value={formData.contactDetails.googleMapIframe}
            onChange={(e) => handleNestedChange('contactDetails', 'googleMapIframe', e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500 resize-none"
          />
        </div>
      </div>

      {/* 7. SOCIAL LINKS & CHATBOT */}
      <div className="p-6 rounded-3xl bg-[#0c0c16]/50 border border-white/5 flex flex-col gap-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Settings className="w-4 h-4 text-indigo-400" />
          <span>Social Link Integrations & Chatbot prompt</span>
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.keys(formData.socialLinks).map((soc) => (
            <div key={soc} className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-gray-400 font-bold">{soc}</label>
              <input
                type="text"
                value={formData.socialLinks[soc]}
                onChange={(e) => handleNestedChange('socialLinks', soc, e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-[10px] uppercase text-gray-400 font-bold">AI Bot Persona & Knowledge Guidelines Context</label>
          <textarea
            rows="5"
            value={formData.aiAssistantPrompt}
            onChange={(e) => handleTextChange('aiAssistantPrompt', e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500 resize-none font-mono"
          />
        </div>
      </div>

      {/* 8. RESUME CV DOCUMENT */}
      <div className="p-6 rounded-3xl bg-[#0c0c16]/50 border border-white/5 flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
          <FileText className="w-4 h-4 text-rose-400" />
          <span>Resume Document Handler</span>
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Select and upload your resume file as a PDF document. The platform automatically registers and serves it to recruiters.
        </p>

        {settings.resumeUrl && (
          <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-gray-400 truncate">
            Current Document URL: <a href={settings.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">{settings.resumeUrl}</a>
          </div>
        )}

        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={resumeFileRef}
            onChange={handleResumeUpload}
            accept="application/pdf"
            className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-white/5 file:text-white file:cursor-pointer hover:file:bg-white/10"
          />
        </div>
      </div>

      {/* 9. FOOTER WRAPPER */}
      <div className="p-6 rounded-3xl bg-[#0c0c16]/50 border border-white/5 flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Footer Layout Texts</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Footer Description Text</label>
            <input
              type="text"
              value={formData.footerText}
              onChange={(e) => handleTextChange('footerText', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Copyright Statement Text</label>
            <input
              type="text"
              value={formData.copyrightText}
              onChange={(e) => handleTextChange('copyrightText', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default SettingsManager;
