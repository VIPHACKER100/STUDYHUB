import express from 'express';
import {
    createUpload,
    getUploads,
    getUpload,
    getMyUploads,
    updateUpload,
    deleteUpload,
    downloadFile,
    rateUpload,
    getRatings,
    toggleBookmark,
    getMyBookmarks,
} from '../controllers/uploadController.js';
import { authMiddleware, requireTeacherOrAdmin } from '../middleware/auth.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getUploads);
router.get('/:id', getUpload);
router.get('/:id/ratings', getRatings);

// Protected routes
router.post('/', authMiddleware, requireTeacherOrAdmin, uploadSingle, handleUploadError, createUpload);
router.get('/user/me', authMiddleware, getMyUploads);
router.put('/:id', authMiddleware, updateUpload);
router.delete('/:id', authMiddleware, deleteUpload);
router.get('/:id/download', authMiddleware, downloadFile);
router.post('/:id/rate', authMiddleware, rateUpload);
router.post('/:id/bookmark', authMiddleware, toggleBookmark);
router.get('/bookmarks/me', authMiddleware, getMyBookmarks);

export default router;
