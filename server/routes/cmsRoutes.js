import express from 'express';
import { 
  getRecycleBin, 
  restoreItem, 
  duplicateItem, 
  handleBulkAction, 
  reorderItems 
} from '../controllers/cmsController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// All CMS helper routes are guarded with admin authentication
router.use(protect);

router.get('/:resource/recycle-bin', getRecycleBin);
router.put('/:resource/:id/restore', restoreItem);
router.post('/:resource/:id/duplicate', duplicateItem);
router.post('/:resource/bulk', handleBulkAction);
router.put('/:resource/reorder', reorderItems);

export default router;
