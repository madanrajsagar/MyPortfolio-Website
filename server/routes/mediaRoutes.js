import express from 'express';
import { 
  getAllMedia, 
  uploadMediaFile, 
  deleteMediaFile 
} from '../controllers/mediaController.js';
import protect from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Guarded with admin authentication
router.use(protect);

router.get('/', getAllMedia);
router.post('/upload', upload.single('file'), uploadMediaFile);
router.delete('/:id', deleteMediaFile);

export default router;
