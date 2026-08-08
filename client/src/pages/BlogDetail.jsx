import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Heart, MessageSquare, AlertCircle, Send, CheckCircle2, User } from 'lucide-react';
import api from '../services/api.js';

const BlogDetail = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Fetch blog data by slug
  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data } = await api.get(`/blogs/slug/${slug}`);
      return data.data;
    },
  });

  // Like Blog Mutation
  const likeMutation = useMutation({
    mutationFn: () => api.post(`/blogs/${blog._id}/like`),
    onSuccess: (data) => {
      // Optimistically update query client state
      queryClient.setQueryData(['blog', slug], (old) => {
        return old ? { ...old, likes: data.data.likes } : old;
      });
    },
  });

  // Submit Comment Mutation
  const commentMutation = useMutation({
    mutationFn: (newComment) => api.post(`/blogs/${blog._id}/comments`, newComment),
    onSuccess: (res) => {
      setCommentSuccess(true);
      setCommentName('');
      setCommentEmail('');
      setCommentContent('');
      queryClient.invalidateQueries(['blog', slug]);
      setTimeout(() => setCommentSuccess(false), 5000);
    },
    onError: (err) => {
      setCommentError(err.response?.data?.message || 'Failed to submit comment');
    },
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setCommentError('');
    if (!commentName || !commentEmail || !commentContent) {
      setCommentError('Please fill in all comment inputs');
      return;
    }
    commentMutation.mutate({
      username: commentName,
      email: commentEmail,
      content: commentContent,
    });
  };

  // Simple self-contained Markdown to HTML renderer helper
  const renderMarkdown = (text = '') => {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Header 3
    html = html.replace(/^### (.*$)/gim, '<h4 class="text-md sm:text-lg font-bold text-white mt-6 mb-2">$1</h4>');
    // Header 2
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-lg sm:text-xl font-bold text-white mt-8 mb-3">$1</h3>');
    // Header 1
    html = html.replace(/^# (.*$)/gim, '<h2 class="text-xl sm:text-2xl font-black text-white mt-10 mb-4">$1</h2>');
    
    // Bold text
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    // Italic text
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/gim, '<pre class="bg-white/5 border border-white/5 p-4 rounded-xl text-xs font-mono text-indigo-300 my-4 overflow-x-auto">$1</pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code class="bg-white/5 px-1.5 py-0.5 rounded font-mono text-xs text-indigo-400">$1</code>');
    
    // Line breaks
    html = html.replace(/\n$/gim, '<br />');

    return { __html: html };
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4">
        <span className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-gray-500 font-medium">Loading blog article...</span>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-[60vh] max-w-xl mx-auto px-6 flex flex-col justify-center items-center text-center gap-6">
        <AlertCircle className="w-16 h-16 text-rose-500 animate-bounce" />
        <div>
          <h2 className="text-xl font-display font-bold text-white">Blog Article Not Found</h2>
          <p className="text-xs text-gray-500 mt-2">
            The blog article you are looking for has been moved or deleted.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back button */}
      <Link
        to="/#blogs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Articles</span>
      </Link>

      {/* Main thumbnail */}
      <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/10 mb-8 bg-bgDark">
        <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
      </div>

      {/* Title block */}
      <div className="flex flex-col gap-3 mb-8">
        <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold px-3 py-1 rounded-full w-max uppercase">
          {blog.category}
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white leading-tight">
          {blog.title}
        </h1>
        <div className="flex gap-4 items-center text-xs text-gray-500 mt-1">
          <span>Published: {new Date(blog.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{blog.views} views</span>
        </div>
      </div>

      {/* Main HTML content parsed */}
      <article
        className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-6 pb-12 border-b border-white/5"
        dangerouslySetInnerHTML={renderMarkdown(blog.content)}
      />

      {/* Actions (Likes indicator) */}
      <div className="py-6 flex items-center gap-6 border-b border-white/5">
        <button
          onClick={() => likeMutation.mutate()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:bg-pink-500/20 transition-all font-semibold text-xs"
        >
          <Heart className="w-4 h-4 fill-pink-400" />
          <span>{blog.likes} Likes</span>
        </button>

        <span className="text-xs text-gray-500 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4" />
          {blog.comments?.length || 0} Comments
        </span>
      </div>

      {/* Comments List */}
      <div className="py-12 flex flex-col gap-8">
        <h3 className="text-lg font-display font-bold text-white">Comments</h3>

        <div className="flex flex-col gap-4">
          {(!blog.comments || blog.comments.length === 0) ? (
            <p className="text-xs text-gray-500 italic">No comments yet. Be the first to comment!</p>
          ) : (
            blog.comments.map((comm) => (
              <div key={comm._id} className="p-4 rounded-2xl glass-card border border-white/5 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white">{comm.username}</span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(comm.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">{comm.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment input form */}
        <form onSubmit={handleCommentSubmit} className="mt-6 p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Leave a Comment</h4>
          
          {commentSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Comment submitted successfully!</span>
            </div>
          )}

          {commentError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{commentError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              placeholder="Your name"
              className="bg-[#030307] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
            />
            <input
              type="email"
              value={commentEmail}
              onChange={(e) => setCommentEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-[#030307] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <textarea
            rows="3"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Type comment message..."
            className="bg-[#030307] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50 resize-none"
          />

          <button
            type="submit"
            disabled={commentMutation.isPending}
            className="w-max px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors self-end clickable"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Comment</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogDetail;
