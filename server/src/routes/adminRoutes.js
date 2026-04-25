import express from 'express';
// authorize/protect are replaced by requireAdmin logic likely, or need to be imported correctly. 
// Assuming auth.js has correct exports, but let's just keep the necessary ones.
import { authMiddleware, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require Admin role
router.use(authMiddleware);
router.use(requireAdmin);

import {
    getDashboardStats,
    getTrends,
    getUsers,
    updateUserRole,
    toggleUserStatus,
    getReports,
    resolveReport
} from '../controllers/adminController.js';

// ... other imports

router.get('/stats', getDashboardStats);
router.get('/trends', getTrends);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', toggleUserStatus);
router.get('/reports', getReports);
router.put('/reports/:id/resolve', resolveReport);

import { getAdminUploads, deleteUpload } from '../controllers/adminController.js';
router.get('/uploads', getAdminUploads);
router.delete('/uploads/:id', deleteUpload);

export default router;

