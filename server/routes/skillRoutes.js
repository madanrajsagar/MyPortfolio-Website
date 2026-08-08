import express from 'express';
import {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  bulkUpdateSkills,
} from '../controllers/skillController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllSkills)
  .post(protect, createSkill);

router.put('/bulk', protect, bulkUpdateSkills);

router.route('/:id')
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

export default router;
