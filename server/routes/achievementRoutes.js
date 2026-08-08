import express from 'express';
import {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievementController.js';
import protect from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllAchievements)
  .post(
    protect,
    upload.fields([
      { name: 'certificate', maxCount: 1 },
      { name: 'photos', maxCount: 5 },
    ]),
    createAchievement
  );

router.route('/:id')
  .put(
    protect,
    upload.fields([
      { name: 'certificate', maxCount: 1 },
      { name: 'photos', maxCount: 5 },
    ]),
    updateAchievement
  )
  .delete(protect, deleteAchievement);

export default router;
