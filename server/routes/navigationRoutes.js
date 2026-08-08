import express from 'express';
import {
  getNavigationLinks,
  createNavigationLink,
  updateNavigationLink,
  deleteNavigationLink,
  batchReorderLinks,
} from '../controllers/navigationController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET routes are open to visitors
router.get('/', getNavigationLinks);

// Mutation routes require admin authentication
router.post('/', protect, createNavigationLink);
router.put('/reorder', protect, batchReorderLinks);
router.put('/:id', protect, updateNavigationLink);
router.delete('/:id', protect, deleteNavigationLink);

export default router;
