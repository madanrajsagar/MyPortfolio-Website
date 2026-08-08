import express from 'express';
import {
  getAllEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllEducation)
  .post(protect, createEducation);

router.route('/:id')
  .put(protect, updateEducation)
  .delete(protect, deleteEducation);

export default router;
