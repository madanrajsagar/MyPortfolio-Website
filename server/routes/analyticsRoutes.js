import express from 'express';
import { getDashboardStats, logEvent } from '../controllers/analyticsController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getDashboardStats);
router.post('/event', logEvent);

export default router;
