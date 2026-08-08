import express from 'express';
import {
  getAllProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import protect from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllProjects)
  .post(
    protect,
    upload.fields([
      { name: 'heroImage', maxCount: 1 },
      { name: 'gallery', maxCount: 10 },
    ]),
    createProject
  );

router.route('/:id')
  .put(
    protect,
    upload.fields([
      { name: 'heroImage', maxCount: 1 },
      { name: 'gallery', maxCount: 10 },
    ]),
    updateProject
  )
  .delete(protect, deleteProject);

router.get('/slug/:slug', getProjectBySlug);

export default router;
