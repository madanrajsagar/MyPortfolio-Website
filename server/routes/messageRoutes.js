import express from 'express';
import {
  sendMessage,
  getAllMessages,
  markAsRead,
  deleteMessage,
} from '../controllers/messageController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAllMessages)
  .post(sendMessage);

router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

export default router;
