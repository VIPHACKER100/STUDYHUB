import express from 'express';
import { searchContent } from '../controllers/searchController.js';

const router = express.Router();

// Public search route (can add optional auth if needed for private content later)
router.get('/', searchContent);

export default router;

