import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Key, FileText, Upload, Check, AlertCircle, Save } from 'lucide-react';
import api from '../../services/api.js';

const AdminProfile = () => {
  const queryClient = useQueryClient();
  const resumeFileRef = useRef(null);

  // States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch current admin profile details
  const { data: meRes, isLoading: meLoading } = useQuery({
    queryKey: ['admin-me'],
    queryFn: () => api.get('/auth/me'),
  });

  // Fetch current settings for resume PDF URL
  const { data: settingsRes, isLoading: settingsLoading } = useQuery({
    queryKey: ['admin-settings-resume'],
    queryFn: () => api.get('/settings'),
  });

  const me = meRes?.data?.user || {};
  const settings = settingsRes?.data?.data || {};

  // Initialize inputs if loaded
  React.useEffect(() => {
    if (me.username) setUsername(me.username);
    if (me.email) setEmail(me.email);
  }, [me]);

  // Update profile details mutation
  const updateProfileMutation = useMutation({
    mutationFn: (payload) => api.put('/auth/profile', payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['admin-me']);
      setPassword('');
      setConfirmPassword('');
      setSuccess('Account profile credentials updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Profile update failed.');
      setTimeout(() => setError(''), 4000);
    }
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const payload = { username, email };
    if (password) payload.password = password;

    updateProfileMutation.mutate(payload);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('resume', file);

    try {
      const res = await api.post('/settings/resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        setSuccess('New Resume CV PDF uploaded and published successfully!');
        queryClient.invalidateQueries(['admin-settings-resume']);
        queryClient.invalidateQueries(['settings']);
        if (resumeFileRef.current) resumeFileRef.current.value = '';
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload Resume PDF.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  if (meLoading || settingsLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-display font-bold text-white">Profile & Resume Manager</h2>
        <p className="text-xs text-gray-500 mt-1">Configure your login credentials and publish updated copies of your resume.</p>
      </div>

      {/* Notifications */}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Account credentials card */}
        <form onSubmit={handleUpdateProfile} className="lg:col-span-7 p-6 rounded-3xl bg-[#0c0c16]/50 border border-white/5 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Account Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-gray-500 font-bold">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-gray-500 font-bold">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="h-[1px] bg-white/5 my-2" />

          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Key className="w-4 h-4 text-pink-400" />
            <span>Change Password (Leave blank to keep current)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-gray-500 font-bold">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-gray-500 font-bold">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isLoading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-500/10 cursor-pointer mt-2 w-max self-end"
          >
            <Save className="w-4 h-4" />
            <span>Update Details</span>
          </button>
        </form>

        {/* Resume CV Uploader card */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0c0c16]/50 border border-white/5 flex flex-col gap-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
            <FileText className="w-4 h-4 text-rose-400" />
            <span>Resume Document Upload</span>
          </h3>

          <p className="text-xs text-gray-500 leading-relaxed">
            Select and upload your resume file as a PDF document. The platform automatically registers and serves it to recruiters.
          </p>

          {settings.resumeUrl ? (
            <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Current Published Resume Link</span>
              <a 
                href={settings.resumeUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-indigo-400 hover:underline truncate"
              >
                {settings.resumeUrl}
              </a>
            </div>
          ) : (
            <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 text-rose-300 text-xs rounded-2xl">
              No resume document published yet. Upload one below.
            </div>
          )}

          <label className={`border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            actionLoading ? 'opacity-50 pointer-events-none' : ''
          }`}>
            <Upload className="w-8 h-8 text-gray-500 animate-pulse" />
            <div className="text-center">
              <span className="text-xs text-gray-300 font-semibold block">Click to select PDF</span>
              <span className="text-[10px] text-gray-500 mt-1 block">Limit 10MB • application/pdf</span>
            </div>
            <input
              type="file"
              ref={resumeFileRef}
              onChange={handleResumeUpload}
              accept="application/pdf"
              className="hidden"
              disabled={actionLoading}
            />
          </label>
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;
