import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, RotateCcw, ShieldAlert, Check, FileText, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import api from '../../services/api.js';

const RecycleBin = () => {
  const queryClient = useQueryClient();
  const [resource, setResource] = useState('projects');
  const [selectedIds, setSelectedIds] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const resources = [
    { label: 'Case Studies / Projects', value: 'projects' },
    { label: 'Blog Posts', value: 'blogs' },
    { label: 'Technical Skills', value: 'skills' },
    { label: 'Achievements', value: 'achievements' },
    { label: 'Work Experience', value: 'experiences' },
    { label: 'Education timeline', value: 'educations' },
    { label: 'Certificates', value: 'certificates' },
    { label: 'Gallery Media', value: 'gallery' },
  ];

  // Fetch trash items for selected resource
  const { data: trashRes, isLoading, refetch } = useQuery({
    queryKey: ['admin-trash', resource],
    queryFn: () => api.get(`/cms/${resource}/recycle-bin`),
  });

  const trashList = trashRes?.data?.data || [];

  // Bulk action mutation
  const bulkMutation = useMutation({
    mutationFn: (payload) => api.post(`/cms/${resource}/bulk`, payload),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries(['admin-trash', resource]);
      queryClient.invalidateQueries([`admin-${resource}`]);
      setSelectedIds([]);
      setSuccess(`Selected items successfully ${variables.action === 'restore' ? 'restored to draft' : 'purged permanently'}.`);
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Bulk action failed');
      setTimeout(() => setError(''), 3000);
    }
  });

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === trashList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(trashList.map(item => item._id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) return;
    const confirmMsg = action === 'permanent-delete' 
      ? `Are you sure you want to PERMANENTLY delete these ${selectedIds.length} items? This cannot be undone.`
      : `Restore these ${selectedIds.length} items to Draft status?`;
      
    if (window.confirm(confirmMsg)) {
      bulkMutation.mutate({ ids: selectedIds, action });
    }
  };

  const handleSingleAction = (id, action) => {
    const confirmMsg = action === 'permanent-delete' 
      ? 'Are you sure you want to PERMANENTLY delete this item? This action is irreversible.'
      : 'Restore this item to Draft status?';
      
    if (window.confirm(confirmMsg)) {
      bulkMutation.mutate({ ids: [id], action });
    }
  };

  const getItemTitle = (item) => {
    return item.title || item.name || item.institution || item.company || item.degree || 'Untitled Item';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">Recycle Bin</h2>
          <p className="text-xs text-gray-500 mt-1">Safe trash collection. Restore deleted entries to draft or purge them permanently.</p>
        </div>

        {/* Resource Selector Dropdown */}
        <select
          value={resource}
          onChange={(e) => {
            setResource(e.target.value);
            setSelectedIds([]);
          }}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold focus:border-indigo-500 outline-none cursor-pointer"
        >
          {resources.map(res => (
            <option key={res.value} value={res.value} className="bg-bgDark text-gray-300">
              {res.label}
            </option>
          ))}
        </select>
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
          <ShieldAlert className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Bulk action header buttons */}
      {trashList.length > 0 && (
        <div className="flex items-center gap-4 bg-[#0c0c16]/50 border border-white/5 px-4 py-3 rounded-2xl">
          <button
            onClick={toggleSelectAll}
            className="text-gray-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
          >
            {selectedIds.length === trashList.length ? (
              <CheckSquare className="w-4 h-4 text-indigo-500" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            <span>Select All ({selectedIds.length})</span>
          </button>

          <div className="h-4 w-[1px] bg-white/10" />

          <button
            onClick={() => handleBulkAction('restore')}
            disabled={selectedIds.length === 0}
            className="text-emerald-400 hover:text-emerald-300 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Bulk Restore</span>
          </button>

          <button
            onClick={() => handleBulkAction('permanent-delete')}
            disabled={selectedIds.length === 0}
            className="text-rose-400 hover:text-rose-300 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bulk Purge</span>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <span className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : trashList.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-3xl p-12 text-center flex flex-col items-center gap-3">
          <Trash2 className="w-12 h-12 text-gray-600" />
          <p className="text-sm text-gray-500 font-medium">Recycle bin is empty for this resource.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {trashList.map((item) => (
            <div key={item._id} className="flex justify-between items-center p-4 bg-[#0c0c16]/30 border border-white/5 rounded-2xl gap-4 hover:border-white/10 transition-all">
              <div className="flex items-center gap-3 min-w-0">
                {/* Checkbox select */}
                <button 
                  onClick={() => toggleSelect(item._id)} 
                  className="text-gray-500 hover:text-white shrink-0"
                >
                  {selectedIds.includes(item._id) ? (
                    <CheckSquare className="w-4 h-4 text-indigo-500" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>

                <div className="flex items-center gap-2 text-gray-500 shrink-0">
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate">
                    {getItemTitle(item)}
                  </span>
                  {item.deletedAt && (
                    <span className="text-[10px] text-gray-500 mt-0.5">
                      Deleted: {new Date(item.deletedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Single row actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleSingleAction(item._id, 'restore')}
                  className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-semibold transition-all flex items-center gap-1"
                  title="Restore to active drafts"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Restore</span>
                </button>

                <button
                  onClick={() => handleSingleAction(item._id, 'permanent-delete')}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-semibold transition-all flex items-center gap-1"
                  title="Delete permanently from Database"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Purge</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecycleBin;
