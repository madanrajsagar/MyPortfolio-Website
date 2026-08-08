import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Copy, Check, Trash2, FileText, Video, Image as ImageIcon, AlertCircle } from 'lucide-react';
import api from '../../services/api.js';

const MediaLibrary = () => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all media items
  const { data: mediaRes, isLoading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: () => api.get('/media'),
  });

  const mediaList = mediaRes?.data?.data || [];

  // Delete media mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-media']);
      setSuccess('Media deleted successfully.');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to delete media');
      setTimeout(() => setError(''), 3000);
    }
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        setSuccess('File uploaded to Cloudinary successfully!');
        queryClient.invalidateQueries(['admin-media']);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'File upload failed');
      setTimeout(() => setError(''), 4000);
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this file permanently from Cloudinary?')) {
      deleteMutation.mutate(id);
    }
  };

  const getMediaIcon = (type) => {
    if (type === 'pdf') return <FileText className="w-10 h-10 text-rose-400" />;
    if (type === 'video') return <Video className="w-10 h-10 text-amber-400" />;
    return <ImageIcon className="w-10 h-10 text-indigo-400" />;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">Media Library</h2>
          <p className="text-xs text-gray-500 mt-1">Upload and catalog image assets, project screenshots, video demos, and PDFs.</p>
        </div>

        {/* Uploader Input label button */}
        <label className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
          uploading 
            ? 'bg-indigo-600/50 text-indigo-300 pointer-events-none'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/10'
        }`}>
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading to Cloudinary...' : 'Upload New File'}</span>
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*,application/pdf"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Action Notifications */}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <span className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : mediaList.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-3xl p-12 text-center flex flex-col items-center gap-3">
          <ImageIcon className="w-12 h-12 text-gray-600" />
          <p className="text-sm text-gray-500 font-medium">No media uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mediaList.map((item) => {
            const formattedSize = (item.fileSize / 1024).toFixed(1) + ' KB';
            return (
              <div key={item._id} className="group glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between relative">
                
                {/* Preview Thumbnail area */}
                <div className="aspect-[4/3] bg-bgDark flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                  {item.mediaType === 'image' ? (
                    <img 
                      src={item.mediaUrl} 
                      alt={item.fileName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      {getMediaIcon(item.mediaType)}
                      <span className="text-[10px] uppercase font-bold text-gray-500">{item.mediaType}</span>
                    </div>
                  )}
                </div>

                {/* Info and action panel */}
                <div className="p-3.5 flex flex-col gap-2.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white truncate" title={item.fileName}>
                      {item.fileName}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-0.5">
                      {item.mimeType} • {formattedSize}
                    </span>
                  </div>

                  <div className="flex gap-2 border-t border-white/5 pt-2.5">
                    <button
                      onClick={() => handleCopy(item.mediaUrl, item._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-[10px] font-semibold"
                      title="Copy URL link to clipboard"
                    >
                      {copiedId === item._id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/45 text-rose-400 transition-all flex justify-center items-center"
                      title="Delete asset permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
