import express from 'express';
import { chatWithAssistant } from '../controllers/aiController.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/chat', apiLimiter, chatWithAssistant);

export default router;
