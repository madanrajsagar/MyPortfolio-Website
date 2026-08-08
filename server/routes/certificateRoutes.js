import express from 'express';
import {
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../controllers/certificateController.js';
import protect from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllCertificates)
  .post(protect, upload.any(), createCertificate);

router.route('/:id')
  .put(protect, upload.any(), updateCertificate)
  .delete(protect, deleteCertificate);

export default router;
