import express from 'express';
import {
  getAllHighlights,
  createHighlight,
  updateHighlight,
  deleteHighlight,
} from '../controllers/highlightController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllHighlights)
  .post(protect, createHighlight);

router.route('/:id')
  .put(protect, updateHighlight)
  .delete(protect, deleteHighlight);

export default router;
