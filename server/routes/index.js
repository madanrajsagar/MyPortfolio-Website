import express from 'express';
import authRoutes from './authRoutes.js';
import projectRoutes from './projectRoutes.js';
import blogRoutes from './blogRoutes.js';
import skillRoutes from './skillRoutes.js';
import achievementRoutes from './achievementRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import experienceRoutes from './experienceRoutes.js';
import educationRoutes from './educationRoutes.js';
import galleryRoutes from './galleryRoutes.js';
import messageRoutes from './messageRoutes.js';
import settingRoutes from './settingRoutes.js';
import aiRoutes from './aiRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import cmsRoutes from './cmsRoutes.js';
import mediaRoutes from './mediaRoutes.js';
import navigationRoutes from './navigationRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/blogs', blogRoutes);
router.use('/skills', skillRoutes);
router.use('/achievements', achievementRoutes);
router.use('/certificates', certificateRoutes);
router.use('/experience', experienceRoutes);
router.use('/education', educationRoutes);
router.use('/gallery', galleryRoutes);
router.use('/messages', messageRoutes);
router.use('/settings', settingRoutes);
router.use('/ai', aiRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/cms', cmsRoutes);
router.use('/media', mediaRoutes);
router.use('/navigation', navigationRoutes);

export default router;
