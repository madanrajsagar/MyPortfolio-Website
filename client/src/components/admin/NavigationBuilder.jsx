import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, ArrowUp, ArrowDown, Edit2, Check, X, FileText, Link as LinkIcon, Save } from 'lucide-react';
import api from '../../services/api.js';

const NavigationBuilder = () => {
  const queryClient = useQueryClient();
  const [label, setLabel] = useState('');
  const [path, setPath] = useState('');
  const [editId, setEditId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editPath, setEditPath] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch navigation links
  const { data: navRes, isLoading } = useQuery({
    queryKey: ['admin-navigation'],
    queryFn: () => api.get('/navigation'),
  });

  const links = navRes?.data?.data || [];

  // Create link mutation
  const createMutation = useMutation({
    mutationFn: (newLink) => api.post('/navigation', newLink),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-navigation']);
      setLabel('');
      setPath('');
      setSuccess('Navigation link created!');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Create failed');
      setTimeout(() => setError(''), 3000);
    }
  });

  // Update link mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/navigation/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-navigation']);
      setEditId(null);
      setSuccess('Navigation link updated!');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Update failed');
      setTimeout(() => setError(''), 3000);
    }
  });

  // Delete link mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/navigation/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-navigation']);
      setSuccess('Link removed.');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Delete failed');
      setTimeout(() => setError(''), 3000);
    }
  });

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: (payload) => api.put('/navigation/reorder', { links: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-navigation']);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Reorder saving failed');
      setTimeout(() => setError(''), 3000);
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!label || !path) return;
    createMutation.mutate({ label, path, order: links.length + 1 });
  };

  const startEdit = (link) => {
    setEditId(link._id);
    setEditLabel(link.label);
    setEditPath(link.path);
  };

  const handleUpdate = (id) => {
    if (!editLabel || !editPath) return;
    updateMutation.mutate({
      id,
      payload: { label: editLabel, path: editPath }
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this navigation link from header/footer menus?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleMove = (index, direction) => {
    const listCopy = [...links];
    if (direction === 'up' && index > 0) {
      const temp = listCopy[index];
      listCopy[index] = listCopy[index - 1];
      listCopy[index - 1] = temp;
    } else if (direction === 'down' && index < listCopy.length - 1) {
      const temp = listCopy[index];
      listCopy[index] = listCopy[index + 1];
      listCopy[index + 1] = temp;
    }

    const payload = listCopy.map((link, idx) => ({
      id: link._id,
      order: idx + 1
    }));

    reorderMutation.mutate(payload);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-display font-bold text-white">Menu Navigation Builder</h2>
        <p className="text-xs text-gray-500 mt-1">Configure layout header and footer navigation links. Supports page paths and anchor fragments (e.g. <code>/#about</code>).</p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Add link */}
        <form onSubmit={handleCreate} className="lg:col-span-4 p-6 bg-[#0c0c16]/90 border border-white/5 rounded-3xl flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-white/5 pb-2">Add New Menu Link</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Link Label</label>
            <input
              type="text"
              placeholder="e.g. Projects"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-indigo-500 text-xs outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-gray-400 font-bold">Target Route / Anchor</label>
            <input
              type="text"
              placeholder="e.g. /#projects, /gallery"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-indigo-500 text-xs outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Create Link</span>
          </button>
        </form>

        {/* Right List: Reorder / manage */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Links Stack</h3>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <span className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : links.length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-3xl p-8 text-center text-xs text-gray-500">
              No navigation links created yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {links.map((link, idx) => (
                <div key={link._id} className="flex justify-between items-center p-3 bg-[#0c0c16]/50 border border-white/5 rounded-2xl gap-4">
                  {editId === link._id ? (
                    /* EDITING MODE ROW */
                    <div className="flex flex-1 flex-wrap gap-2">
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="flex-1 min-w-[100px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        value={editPath}
                        onChange={(e) => setEditPath(e.target.value)}
                        className="flex-[2] min-w-[150px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
                      />
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleUpdate(link._id)}
                          className="p-2 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/35 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="p-2 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* VIEW MODE ROW */
                    <>
                      <div className="flex items-center gap-3 truncate">
                        <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl shrink-0">
                          <LinkIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-white truncate">{link.label}</span>
                          <span className="text-[10px] text-gray-500 truncate">{link.path}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Up/Down buttons */}
                        <div className="flex gap-1 border-r border-white/5 pr-2.5 mr-0.5">
                          <button
                            onClick={() => handleMove(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                            title="Move Link Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(idx, 'down')}
                            disabled={idx === links.length - 1}
                            className="p-1.5 rounded bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                            title="Move Link Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => startEdit(link)}
                          className="p-1.5 rounded hover:bg-white/5 text-indigo-400"
                          title="Edit link parameters"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(link._id)}
                          className="p-1.5 rounded hover:bg-white/5 text-rose-400"
                          title="Delete link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NavigationBuilder;
