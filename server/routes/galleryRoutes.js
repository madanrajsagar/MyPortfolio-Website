import express from 'express';
import {
  getAllGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import protect from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllGalleryItems)
  .post(protect, upload.single('media'), createGalleryItem);

router.delete('/:id', protect, deleteGalleryItem);

export default router;
