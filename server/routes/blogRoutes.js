import express from 'express';
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  deleteComment,
} from '../controllers/blogController.js';
import protect from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllBlogs)
  .post(protect, upload.single('thumbnail'), createBlog);

router.route('/:id')
  .put(protect, upload.single('thumbnail'), updateBlog)
  .delete(protect, deleteBlog);

router.get('/slug/:slug', getBlogBySlug);
router.post('/:id/like', likeBlog);
router.post('/:id/comments', addComment);
router.delete('/:blogId/comments/:commentId', protect, deleteComment);

export default router;
