import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShieldAlert, BarChart3, FolderGit2, BookOpen, Brain, Briefcase, Award,
  Image as ImageIcon, Mail, Settings, Plus, Edit, Trash2, CheckCircle2,
  AlertCircle, Upload, Eye, FileText, ArrowRight, Save, Copy, Check, User, Trophy, X
} from 'lucide-react';
import api from '../services/api.js';
import MediaLibrary from '../components/admin/MediaLibrary.jsx';
import NavigationBuilder from '../components/admin/NavigationBuilder.jsx';
import RecycleBin from '../components/admin/RecycleBin.jsx';
import SettingsManager from '../components/admin/SettingsManager.jsx';
import AdminProfile from '../components/admin/AdminProfile.jsx';

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('stats');

  // Form states
  const [editItemId, setEditItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // projects, blogs, skills, etc
  const [formData, setFormData] = useState({});

  // File refs
  const heroImageRef = useRef(null);
  const galleryImagesRef = useRef(null);
  const thumbnailRef = useRef(null);
  const certImageRef = useRef(null);
  const galleryMediaRef = useRef(null);
  const resumeFileRef = useRef(null);
  const certFileRef = useRef(null);
  const photoFilesRef = useRef(null);

  // Status triggers
  const [opSuccess, setOpSuccess] = useState('');
  const [opError, setOpError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, authLoading, navigate]);

  // Fetch Dashboard Stats
  const { data: statsRes } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/analytics'),
    enabled: isAdmin,
  });

  // Fetch all resources for list grids
  const { data: projectsRes } = useQuery({ queryKey: ['admin-projects'], queryFn: () => api.get('/projects?all=true'), enabled: isAdmin });
  const { data: blogsRes } = useQuery({ queryKey: ['admin-blogs'], queryFn: () => api.get('/blogs?all=true'), enabled: isAdmin });
  const { data: skillsRes } = useQuery({ queryKey: ['admin-skills'], queryFn: () => api.get('/skills'), enabled: isAdmin });
  const { data: achievementsRes } = useQuery({ queryKey: ['admin-achievements'], queryFn: () => api.get('/achievements?all=true'), enabled: isAdmin });
  const { data: educationsRes } = useQuery({ queryKey: ['admin-educations'], queryFn: () => api.get('/education'), enabled: isAdmin });
  const { data: certificatesRes } = useQuery({ queryKey: ['admin-certificates'], queryFn: () => api.get('/certificates'), enabled: isAdmin });
  const { data: galleryRes } = useQuery({ queryKey: ['admin-gallery'], queryFn: () => api.get('/gallery'), enabled: isAdmin });
  const { data: messagesRes } = useQuery({ queryKey: ['admin-messages'], queryFn: () => api.get('/messages'), enabled: isAdmin });
  const { data: settingsRes } = useQuery({ queryKey: ['admin-settings'], queryFn: () => api.get('/settings'), enabled: isAdmin });
  const { data: experiencesRes } = useQuery({ queryKey: ['admin-experiences'], queryFn: () => api.get('/experience'), enabled: isAdmin });

  const stats = statsRes?.data?.data || {};
  const projects = projectsRes?.data?.data || [];
  const blogs = blogsRes?.data?.data || [];
  const skills = skillsRes?.data?.data || [];
  const experiences = experiencesRes?.data?.data || [];
  const achievements = achievementsRes?.data?.data || [];
  const educations = educationsRes?.data?.data || [];
  const certificates = certificatesRes?.data?.data || [];
  const gallery = galleryRes?.data?.data || [];
  const messages = messagesRes?.data?.data || [];
  const settings = settingsRes?.data?.data || {};

  const handleOpenCreateModal = (type) => {
    setModalType(type);
    setEditItemId(null);
    if (type === 'certificates') {
      setFormData({ category: 'Cloud', status: 'published', issueDate: new Date().toISOString().substring(0, 10) });
    } else if (type === 'projects') {
      setFormData({ category: 'Full Stack', status: 'published', featured: false });
    } else if (type === 'achievements') {
      setFormData({ category: 'Hackathon', status: 'published' });
    } else {
      setFormData({ status: 'published' });
    }
    setShowModal(true);
  };

  const safeFormatDate = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? '' : d.toISOString().substring(0, 10);
  };

  const handleOpenEditModal = (type, item) => {
    setModalType(type);
    setEditItemId(item._id);
    
    // Copy item details, formatting dates if needed
    const copy = { ...item };
    if (copy.startDate) copy.startDate = safeFormatDate(copy.startDate);
    if (copy.endDate) copy.endDate = safeFormatDate(copy.endDate);
    if (copy.issueDate) copy.issueDate = safeFormatDate(copy.issueDate);
    if (copy.date) copy.date = safeFormatDate(copy.date);
    
    setFormData(copy);
    setShowModal(true);
  };

  // Delete Mutation Generic Helper
  const handleDeleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to move this item to the Recycle Bin?`)) return;
    try {
      const res = await api.delete(`/${type}/${id}`);
      if (res.data?.success) {
        queryClient.invalidateQueries([`admin-${type}`]);
        setOpSuccess('Moved to Recycle Bin successfully');
        setTimeout(() => setOpSuccess(''), 3000);
      }
    } catch (err) {
      setOpError(err.response?.data?.message || 'Delete operation failed');
      setTimeout(() => setOpError(''), 3000);
    }
  };

  // Duplicate Generic Helper
  const handleDuplicateItem = async (type, id) => {
    try {
      setActionLoading(true);
      const res = await api.post(`/cms/${type}/${id}/duplicate`);
      if (res.data?.success) {
        queryClient.invalidateQueries([`admin-${type}`]);
        setOpSuccess('Item duplicated successfully!');
        setTimeout(() => setOpSuccess(''), 3000);
      }
    } catch (err) {
      setOpError(err.response?.data?.message || 'Duplication failed');
      setTimeout(() => setOpError(''), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Publish Generic Helper
  const handleTogglePublish = async (type, item) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      setActionLoading(true);
      const res = await api.put(`/${type}/${item._id}`, { status: newStatus });
      if (res.data?.success) {
        queryClient.invalidateQueries([`admin-${type}`]);
        setOpSuccess(`Status updated to ${newStatus}`);
        setTimeout(() => setOpSuccess(''), 3000);
      }
    } catch (err) {
      setOpError(err.response?.data?.message || 'Status toggle failed');
      setTimeout(() => setOpError(''), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  // Mark message as read
  const handleMarkMessageRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      queryClient.invalidateQueries(['admin-messages']);
      queryClient.invalidateQueries(['admin-stats']);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit operations (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setOpError('');
    setOpSuccess('');
    setActionLoading(true);

    try {
      let res;
      // Use FormData for file uploads, standard JSON otherwise
      const hasFiles = 
        (modalType === 'projects' && (heroImageRef.current?.files[0] || galleryImagesRef.current?.files[0])) ||
        (modalType === 'blogs' && thumbnailRef.current?.files[0]) ||
        (modalType === 'certificates' && certImageRef.current?.files[0]) ||
        (modalType === 'gallery' && galleryMediaRef.current?.files[0]) ||
        (modalType === 'achievements' && (certFileRef.current?.files[0] || photoFilesRef.current?.files[0]));

      if (hasFiles) {
        const data = new FormData();
        Object.keys(formData).forEach(key => {
          if (['_id', 'createdAt', 'updatedAt', '__v'].includes(key)) return;
          if (formData[key] === null || formData[key] === undefined || formData[key] === 'null') return;
          if (Array.isArray(formData[key])) {
            data.append(key, JSON.stringify(formData[key]));
          } else {
            data.append(key, formData[key]);
          }
        });

        // Append files
        if (modalType === 'projects') {
          if (heroImageRef.current?.files[0]) data.append('heroImage', heroImageRef.current.files[0]);
          if (galleryImagesRef.current?.files) {
            for (let i = 0; i < galleryImagesRef.current.files.length; i++) {
              data.append('gallery', galleryImagesRef.current.files[i]);
            }
          }
        } else if (modalType === 'blogs' && thumbnailRef.current?.files[0]) {
          data.append('thumbnail', thumbnailRef.current.files[0]);
        } else if (modalType === 'certificates' && certImageRef.current?.files[0]) {
          data.append('image', certImageRef.current.files[0]);
        } else if (modalType === 'gallery' && galleryMediaRef.current?.files[0]) {
          data.append('media', galleryMediaRef.current.files[0]);
        } else if (modalType === 'achievements') {
          if (certFileRef.current?.files[0]) data.append('certificate', certFileRef.current.files[0]);
          if (photoFilesRef.current?.files) {
            for (let i = 0; i < photoFilesRef.current.files.length; i++) {
              data.append('photos', photoFilesRef.current.files[i]);
            }
          }
        }

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        if (editItemId) {
          res = await api.put(`/${modalType}/${editItemId}`, data, config);
        } else {
          res = await api.post(`/${modalType}`, data, config);
        }
      } else {
        // Standard JSON
        const cleanPayload = { ...formData };
        delete cleanPayload._id;
        delete cleanPayload.createdAt;
        delete cleanPayload.updatedAt;
        delete cleanPayload.__v;
        if (cleanPayload.deletedAt === null || cleanPayload.deletedAt === 'null' || cleanPayload.deletedAt === undefined) {
          delete cleanPayload.deletedAt;
        }

        if (editItemId) {
          res = await api.put(`/${modalType}/${editItemId}`, cleanPayload);
        } else {
          res = await api.post(`/${modalType}`, cleanPayload);
        }
      }

      if (res.data?.success) {
        setOpSuccess('Operation completed successfully!');
        setShowModal(false);
        queryClient.invalidateQueries([`admin-${modalType}`]);
        queryClient.invalidateQueries(['admin-stats']);
        setTimeout(() => setOpSuccess(''), 3000);
      }
    } catch (err) {
      setOpError(err.response?.data?.message || 'Operation failed. Verify inputs.');
    } finally {
      setActionLoading(false);
    }
  };

  // Settings Save handler
  const handleSaveSettings = async (settingsData) => {
    setActionLoading(true);
    setOpError('');
    setOpSuccess('');
    try {
      const res = await api.put('/settings', settingsData);
      if (res.data?.success) {
        setOpSuccess('Portfolio settings saved successfully!');
        queryClient.invalidateQueries(['admin-settings']);
        setTimeout(() => setOpSuccess(''), 3000);
      }
    } catch (err) {
      setOpError(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setActionLoading(false);
    }
  };

  // Resume File Upload handler
  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFileRef.current?.files[0]) return;
    setActionLoading(true);
    setOpError('');
    setOpSuccess('');

    try {
      const data = new FormData();
      data.append('resume', resumeFileRef.current.files[0]);
      
      const res = await api.post('/settings/resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        setOpSuccess('CV PDF uploaded and registered successfully!');
        queryClient.invalidateQueries(['admin-settings']);
        setTimeout(() => setOpSuccess(''), 3000);
      }
    } catch (err) {
      setOpError(err.response?.data?.message || 'Failed to upload CV PDF.');
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4">
        <span className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-gray-500 font-medium font-display">Authorizing gateway access...</span>
      </div>
    );
  }

  if (!isAdmin) return null;

  const sidebarLinks = [
    { label: 'Overview', id: 'stats', icon: BarChart3 },
    { label: 'Projects', id: 'projects', icon: FolderGit2 },
    { label: 'Achievements', id: 'achievements', icon: Trophy },
    { label: 'Blogs', id: 'blogs', icon: BookOpen },
    { label: 'Skills', id: 'skills', icon: Brain },
    { label: 'Timeline', id: 'experience', icon: Briefcase },
    { label: 'Certificates', id: 'certificates', icon: Award },
    { label: 'Gallery', id: 'gallery', icon: ImageIcon },
    { label: 'Media Library', id: 'media', icon: ImageIcon },
    { label: 'Menu Builder', id: 'navigation', icon: FileText },
    { label: 'Recycle Bin', id: 'recycle', icon: Trash2 },
    { label: 'Admin Profile', id: 'profile', icon: User },
    { label: 'Messages', id: 'messages', icon: Mail, badge: stats?.summary?.unreadMessages },
    { label: 'Config Settings', id: 'settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Sidebar Menu */}
      <aside className="lg:col-span-3 flex flex-col gap-2 bg-[#0c0c16]/90 p-4 rounded-3xl border border-white/5">
        <div className="px-3 py-2 border-b border-white/5 mb-2 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Admin Control</span>
        </div>

        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                activeTab === link.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </div>
              {link.badge > 0 && (
                <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {link.badge}
                </span>
              )}
            </button>
          );
        })}
      </aside>

      {/* Main Content Area */}
      <main className="lg:col-span-9 flex flex-col gap-6">
        {/* Status Alerts */}
        {opSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{opSuccess}</span>
          </div>
        )}
        {opError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4" />
            <span>{opError}</span>
          </div>
        )}

        {/* Dynamic Panels */}
        {activeTab === 'stats' && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { title: 'Page Views', value: stats.summary?.pageViews || 0, color: 'text-sky-400' },
                { title: 'Resume Downloads', value: stats.summary?.downloads || 0, color: 'text-violet-400' },
                { title: 'Contact Messages', value: stats.summary?.messages || 0, color: 'text-pink-400' },
                { title: 'AI Queries', value: stats.summary?.aiQueries || 0, color: 'text-amber-400' },
              ].map((m, i) => (
                <div key={i} className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-28">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{m.title}</span>
                  <span className={`text-2xl font-display font-black mt-2 ${m.color}`}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Country stats list */}
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4">Traffic distribution (Country)</h3>
              <div className="flex flex-col gap-3">
                {(!stats.geoStats || stats.geoStats.length === 0) ? (
                  <p className="text-xs text-gray-500 italic">No traffic recorded yet.</p>
                ) : (
                  stats.geoStats.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-gray-400">
                      <span>{item.country}</span>
                      <span className="font-bold text-white">{item.count} views</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="flex flex-col gap-6">
            <button
              onClick={() => handleOpenCreateModal('projects')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs w-max flex items-center gap-1.5 clickable"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Case Study</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div key={p._id} className="p-5 rounded-2xl glass-card border border-white/5 flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-white text-sm truncate max-w-[200px]" title={p.title}>{p.title}</h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${p.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {p.status || 'draft'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500">Views: {p.views}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleTogglePublish('projects', p)}
                      className={`p-1.5 rounded hover:bg-white/5 ${p.status === 'published' ? 'text-indigo-400' : 'text-gray-500'}`}
                      title={p.status === 'published' ? 'Unpublish (set to Draft)' : 'Publish immediately'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicateItem('projects', p._id)}
                      className="p-1.5 rounded hover:bg-white/5 text-emerald-400"
                      title="Duplicate Case Study"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal('projects', p)}
                      className="p-1.5 rounded hover:bg-white/5 text-indigo-400"
                      title="Edit Case Study"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('projects', p._id)}
                      className="p-1.5 rounded hover:bg-white/5 text-rose-400"
                      title="Move to Recycle Bin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="flex flex-col gap-6">
            <button
              onClick={() => handleOpenCreateModal('achievements')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs w-max flex items-center gap-1.5 clickable"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Achievement</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements && achievements.filter(Boolean).map((a) => (
                <div key={a._id} className="p-5 rounded-2xl glass-card border border-white/5 flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-white text-sm truncate max-w-[200px]" title={a.title}>{a.title}</h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${a.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {a.status || 'draft'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 truncate max-w-[250px]">{a.description}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleTogglePublish('achievements', a)}
                      className={`p-1.5 rounded hover:bg-white/5 ${a.status === 'published' ? 'text-indigo-400' : 'text-gray-500'}`}
                      title={a.status === 'published' ? 'Unpublish (set to Draft)' : 'Publish immediately'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal('achievements', a)}
                      className="p-1.5 rounded hover:bg-white/5 text-indigo-400"
                      title="Edit Achievement"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('achievements', a._id)}
                      className="p-1.5 rounded hover:bg-white/5 text-rose-400"
                      title="Move to Recycle Bin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="flex flex-col gap-6">
            <button
              onClick={() => handleOpenCreateModal('blogs')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs w-max flex items-center gap-1.5 clickable"
            >
              <Plus className="w-4 h-4" />
              <span>Add Blog Post</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogs.map((b) => (
                <div key={b._id} className="p-5 rounded-2xl glass-card border border-white/5 flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-white text-sm truncate max-w-[200px]" title={b.title}>{b.title}</h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${b.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {b.status || 'draft'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase bg-white/5 px-2 py-0.5 border border-white/5 rounded w-max">
                      {b.category}
                    </span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleTogglePublish('blogs', b)}
                      className={`p-1.5 rounded hover:bg-white/5 ${b.status === 'published' ? 'text-indigo-400' : 'text-gray-500'}`}
                      title={b.status === 'published' ? 'Unpublish (set to Draft)' : 'Publish immediately'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicateItem('blogs', b._id)}
                      className="p-1.5 rounded hover:bg-white/5 text-emerald-400"
                      title="Duplicate Post"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal('blogs', b)}
                      className="p-1.5 rounded hover:bg-white/5 text-indigo-400"
                      title="Edit Post"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('blogs', b._id)}
                      className="p-1.5 rounded hover:bg-white/5 text-rose-400"
                      title="Move to Recycle Bin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="flex flex-col gap-6">
            <button
              onClick={() => handleOpenCreateModal('skills')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs w-max flex items-center gap-1.5 clickable"
            >
              <Plus className="w-4 h-4" />
              <span>Register Technical Skill</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((s) => (
                <div key={s._id} className="p-4 rounded-xl glass-card border border-white/5 flex justify-between items-center">
                  <div>
                    <h5 className="font-semibold text-white text-xs">{s.name}</h5>
                    <span className="text-[10px] text-indigo-400 font-bold">{s.proficiency}% • {s.category}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEditModal('skills', s)}
                      className="p-1.5 rounded hover:bg-white/5 text-indigo-400"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('skills', s._id)}
                      className="p-1.5 rounded hover:bg-white/5 text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-3">
              <button
                onClick={() => handleOpenCreateModal('experience')}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 clickable"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
              <button
                onClick={() => handleOpenCreateModal('education')}
                className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs flex items-center gap-1.5 clickable"
              >
                <Plus className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </div>

            {/* Experience list */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Professional & Volunteer Experience</h3>
              <div className="flex flex-col gap-3">
                {experiences.map((exp) => (
                  <div key={exp._id} className="p-4 rounded-xl glass-card border border-white/5 flex justify-between items-center text-xs text-gray-400">
                    <div>
                      <strong className="text-white block">{exp.role}</strong>
                      <span>{exp.company}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEditModal('experience', exp)} className="text-indigo-400 hover:text-white">Edit</button>
                      <button onClick={() => handleDeleteItem('experience', exp._id)} className="text-rose-400 hover:text-white">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education list */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Academic records</h3>
              <div className="flex flex-col gap-3">
                {educations.map((edu) => (
                  <div key={edu._id} className="p-4 rounded-xl glass-card border border-white/5 flex justify-between items-center text-xs text-gray-400">
                    <div>
                      <strong className="text-white block">{edu.degree}</strong>
                      <span>{edu.institution}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEditModal('education', edu)} className="text-indigo-400 hover:text-white">Edit</button>
                      <button onClick={() => handleDeleteItem('education', edu._id)} className="text-rose-400 hover:text-white">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="flex flex-col gap-6">
            <button
              onClick={() => handleOpenCreateModal('certificates')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs w-max flex items-center gap-1.5 clickable"
            >
              <Plus className="w-4 h-4" />
              <span>Register Certificate Credentials</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((c) => (
                <div key={c._id} className="p-4 rounded-xl glass-card border border-white/5 flex justify-between items-center">
                  <div>
                    <h5 className="font-semibold text-white text-xs">{c.title}</h5>
                    <span className="text-[10px] text-gray-500">{c.organization}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditModal('certificates', c)}
                      className="text-indigo-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem('certificates', c._id)}
                      className="text-rose-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="flex flex-col gap-6">
            <button
              onClick={() => handleOpenCreateModal('gallery')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs w-max flex items-center gap-1.5 clickable"
            >
              <Plus className="w-4 h-4" />
              <span>Add Media Gallery file</span>
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g._id} className="relative rounded-lg overflow-hidden border border-white/10 aspect-square group">
                  <img src={g.mediaUrl} alt={g.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                    <button
                      onClick={() => handleDeleteItem('gallery', g._id)}
                      className="p-1.5 rounded-lg bg-rose-600 text-white text-xs hover:bg-rose-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="flex flex-col gap-4">
            {messages.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No contact submissions found in database.</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m._id}
                  className={`p-5 rounded-2xl glass-card border flex flex-col gap-3 relative ${
                    m.isRead ? 'border-white/5' : 'border-indigo-500/30'
                  }`}
                >
                  {!m.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  )}

                  <div className="flex justify-between items-start text-xs text-gray-500">
                    <div>
                      <strong className="text-white block text-sm">{m.name}</strong>
                      <span>{m.email}</span>
                    </div>
                    <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="text-xs font-semibold text-indigo-300">
                    Subject: {m.subject}
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-300 bg-white/5 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                    {m.message}
                  </p>

                  <div className="flex justify-end gap-3 mt-2">
                    {!m.isRead && (
                      <button
                        onClick={() => handleMarkMessageRead(m._id)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteItem('messages', m._id)}
                      className="px-3.5 py-1.5 bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600/30 text-[10px] font-bold rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && <SettingsManager />}
        {activeTab === 'media' && <MediaLibrary />}
        {activeTab === 'navigation' && <NavigationBuilder />}
        {activeTab === 'recycle' && <RecycleBin />}
        {activeTab === 'profile' && <AdminProfile />}
      </main>

      {/* Dynamic Creation / Edit Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bgDark/80 backdrop-blur-md" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-xl bg-[#0b0b14] border border-white/10 rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-display font-bold text-white mb-6 uppercase tracking-wider">
              {editItemId ? 'Update Entry' : 'Create Entry'} - {modalType}
            </h3>

            <form onSubmit={handleSubmitForm} className="flex flex-col gap-4">
              {/* Projects fields */}
              {modalType === 'projects' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-[#101022] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-indigo-400 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Short description</label>
                    <input
                      type="text"
                      required
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[#101022] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-indigo-400 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Tech stack (comma list)</label>
                    <input
                      type="text"
                      value={Array.isArray(formData.techStack) ? formData.techStack.join(', ') : formData.techStack || ''}
                      onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                      placeholder="React, Node, Express"
                      className="bg-[#101022] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-indigo-400 outline-none"
                    />
                  </div>
                  {/* Active Saved Images Gallery */}
                  {((formData.gallery && formData.gallery.length > 0) || formData.heroImage) && (
                    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#0f0f1f] border border-indigo-500/30">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                          Saved Database Images ({((formData.gallery || []).length + (formData.heroImage ? 1 : 0))})
                        </label>
                        <span className="text-[9px] text-gray-400">Hover & click ✖ to remove</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.heroImage && (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-indigo-500 group">
                            <img src={formData.heroImage} alt="Hero" className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 text-[8px] font-bold bg-indigo-600/90 text-white text-center py-0.5">Hero</span>
                          </div>
                        )}
                        {(formData.gallery || []).map((imgUrl, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 group">
                            <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  gallery: (prev.gallery || []).filter((_, i) => i !== idx)
                                }));
                              }}
                              className="absolute inset-0 bg-red-950/80 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove image from database"
                            >
                              <X className="w-4 h-4 text-red-300" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Hero Image file (Replace Hero)</label>
                    <input type="file" ref={heroImageRef} className="text-xs text-gray-300" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Add More Gallery Images (Multiple)</label>
                    <input type="file" multiple ref={galleryImagesRef} className="text-xs text-gray-300" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">GitHub Link</label>
                      <input
                        type="text"
                        value={formData.githubLink || ''}
                        onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                        className="bg-[#101022] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-indigo-400 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Live Deploy Link</label>
                      <input
                        type="text"
                        value={formData.liveDemo || ''}
                        onChange={(e) => setFormData({ ...formData, liveDemo: e.target.value })}
                        className="bg-[#101022] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-indigo-400 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded bg-white/5 border-white/10 text-indigo-600 focus:ring-0"
                    />
                    <label htmlFor="featured" className="text-xs text-gray-400 font-semibold select-none">Featured Case Study</label>
                  </div>
                </>
              )}

              {/* Achievements fields */}
              {modalType === 'achievements' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Description</label>
                    <textarea
                      rows="3"
                      required
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Category</label>
                      <input
                        type="text"
                        required
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Date</label>
                      <input
                        type="date"
                        required
                        value={formData.date || ''}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Event Details / Host</label>
                    <input
                      type="text"
                      value={formData.eventDetails || ''}
                      onChange={(e) => setFormData({ ...formData, eventDetails: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Certificate URL (Optional)</label>
                    <input
                      type="text"
                      value={formData.certificateUrl || ''}
                      onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                  {/* Saved Achievement Photos Gallery */}
                  {(formData.photos && formData.photos.length > 0) && (
                    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Saved Event Photos ({formData.photos.length})
                        </label>
                        <span className="text-[9px] text-gray-500">Hover & click ✖ to remove</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.photos.map((imgUrl, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 group">
                            <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  photos: (prev.photos || []).filter((_, i) => i !== idx)
                                }));
                              }}
                              className="absolute inset-0 bg-red-950/80 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove photo from database"
                            >
                              <X className="w-4 h-4 text-red-300" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Upload Certificate Document</label>
                      <input type="file" ref={certFileRef} className="text-xs text-gray-500" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Upload More Photos (Multiple)</label>
                      <input type="file" multiple ref={photoFilesRef} className="text-xs text-gray-500" />
                    </div>
                  </div>
                </>
              )}

              {/* Blogs fields */}
              {modalType === 'blogs' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Category</label>
                      <input
                        type="text"
                        required
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Thumbnail Image</label>
                      <input type="file" ref={thumbnailRef} className="text-xs text-gray-500" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Blog Content (Markdown)</label>
                    <textarea
                      rows="8"
                      required
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white resize-none font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published || false}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded bg-white/5 border-white/10 text-indigo-600 focus:ring-0"
                    />
                    <label htmlFor="published" className="text-xs text-gray-400 font-semibold select-none">Publish Immediately</label>
                  </div>
                </>
              )}

              {/* Skills fields */}
              {modalType === 'skills' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Skill name</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Category</label>
                      <select
                        required
                        value={formData.category || 'Programming'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {[
                          'Programming Languages',
                          'Frontend Development',
                          'Backend Development',
                          'Database Technologies',
                          'Artificial Intelligence & Machine Learning',
                          'DevOps & Cloud',
                          'Tools & Platforms',
                          'Data Visualization'
                        ].map(c => (
                          <option key={c} value={c} className="bg-bgDark">{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Proficiency (1-100%)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={formData.proficiency || 80}
                        onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Years of experience</label>
                      <input
                        type="number"
                        value={formData.experienceYears || 0}
                        onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Icon reference</label>
                      <input
                        type="text"
                        required
                        value={formData.icon || 'code'}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Level</label>
                      <select
                        value={formData.level || 'Advanced'}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(l => (
                          <option key={l} value={l} className="bg-bgDark">{l}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Emoji Symbol</label>
                      <input
                        type="text"
                        value={formData.emoji || ''}
                        onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                        placeholder="☕, 🐍, ⚛️..."
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Experience fields */}
              {modalType === 'experience' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Company / Org</label>
                    <input
                      type="text"
                      required
                      value={formData.company || ''}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Role / Position</label>
                    <input
                      type="text"
                      required
                      value={formData.role || ''}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Experience Type</label>
                      <select
                        value={formData.type || 'job'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="job" className="bg-bgDark">Job</option>
                        <option value="volunteer" className="bg-bgDark">Volunteer</option>
                        <option value="leadership" className="bg-bgDark">Leadership</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location</label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Start Date</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate || ''}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">End Date</label>
                      <input
                        type="date"
                        disabled={formData.isCurrent}
                        value={formData.endDate || ''}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isCurrent"
                      checked={formData.isCurrent || false}
                      onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                      className="rounded bg-white/5 border-white/10 text-indigo-600 focus:ring-0"
                    />
                    <label htmlFor="isCurrent" className="text-xs text-gray-400 font-semibold select-none">Current Position</label>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Description bullet points (one per line)</label>
                    <textarea
                      rows="4"
                      required
                      value={Array.isArray(formData.description) ? formData.description.join('\n') : formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white resize-none"
                    />
                  </div>
                </>
              )}

              {/* Education fields */}
              {modalType === 'education' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Institution name</label>
                    <input
                      type="text"
                      required
                      value={formData.institution || ''}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Degree</label>
                      <input
                        type="text"
                        required
                        value={formData.degree || ''}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Field of study</label>
                      <input
                        type="text"
                        required
                        value={formData.fieldOfStudy || ''}
                        onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">CGPA Score</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.cgpa || ''}
                        onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Marks Percentage</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.marks || ''}
                        onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Start date</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate || ''}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">End date</label>
                      <input
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Certificates fields */}
              {modalType === 'certificates' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-[#101022] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-indigo-400 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Organization</label>
                      <input
                        type="text"
                        required
                        value={formData.organization || ''}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="bg-[#101022] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-indigo-400 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Category</label>
                      <input
                        type="text"
                        required
                        value={formData.category || 'Cloud'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="bg-[#101022] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-indigo-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Active Saved Certificate Image */}
                  {formData.image && (
                    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#0f0f1f] border border-indigo-500/30">
                      <label className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                        Saved Database Certificate Image
                      </label>
                      <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-white/20">
                        <img src={formData.image} alt="Certificate preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Issue Date</label>
                      <input
                        type="date"
                        required
                        value={formData.issueDate || ''}
                        onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                        className="bg-[#101022] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-indigo-400 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Replace Preview Image</label>
                      <input type="file" ref={certImageRef} className="text-xs text-gray-300" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Credential ID</label>
                      <input
                        type="text"
                        value={formData.credentialId || ''}
                        onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                        className="bg-[#101022] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-indigo-400 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Credential URL</label>
                      <input
                        type="text"
                        value={formData.credentialUrl || ''}
                        onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                        className="bg-[#101022] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-indigo-400 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Gallery fields */}
              {modalType === 'gallery' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Category</label>
                      <select
                        required
                        value={formData.category || 'hackathons'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {['hackathons', 'college', 'events', 'gdg', 'competitions'].map(c => (
                          <option key={c} value={c} className="bg-bgDark">{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Media File</label>
                      <input type="file" ref={galleryMediaRef} className="text-xs text-gray-500" />
                    </div>
                  </div>
                </>
              )}

              {/* Generic Status Select Field */}
              <div className="flex flex-col gap-1.5 border-t border-white/5 pt-4">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Publishing Status Mode</label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="draft" className="bg-bgDark text-gray-300">Draft (Invisible to public)</option>
                  <option value="published" className="bg-bgDark text-gray-300">Published (Visible on site)</option>
                  <option value="archived" className="bg-bgDark text-gray-300">Archived</option>
                </select>
              </div>

              {/* Modal footer submit buttons */}
              <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors clickable"
                >
                  {actionLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
