import express from 'express';
import {
  getSettings,
  updateSettings,
  uploadResumeFile,
} from '../controllers/settingController.js';
import protect from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSettings)
  .put(protect, upload.fields([
    { name: 'logoFile', maxCount: 1 },
    { name: 'faviconFile', maxCount: 1 },
    { name: 'profileImageFile', maxCount: 1 }
  ]), updateSettings);

router.post('/resume', protect, upload.single('resume'), uploadResumeFile);

export default router;
