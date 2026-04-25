import Upload from '../models/Upload.js';
import Notification from '../models/Notification.js';
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';
import cacheService from '../services/cacheService.js';

/**
 * Upload Controller
 */

/**
 * @route   POST /api/uploads
 * @desc    Create new upload
 * @access  Private
 */
export const createUpload = [
    body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('subject').trim().isLength({ min: 2, max: 100 }),
    body('type').isIn(['notes', 'assignment']).withMessage('Type must be notes or assignment'),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                });
            }

            const { title, description, subject, type, tags } = req.body;

            // Parse tags if string
            const parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;

            const upload = await Upload.create({
                userId: req.user.id,
                title,
                description,
                subject,
                type,
                tags: parsedTags || [],
                filePath: req.file.path,
                fileName: req.file.originalname,
                fileSize: req.file.size,
                fileType: req.file.mimetype,
            });

            // Create Notification
            try {
                // Determine target audience. For now, notifying the uploader as confirmation.
                // In a real app, this might go to 'followers' or 'classmates'.
                const notification = await Notification.create({
                    userId: req.user.id,
                    type: 'system', // or 'upload' if we want to differentiate
                    title: 'Upload Successful',
                    message: `Your file "${title}" has been uploaded successfully.`,
                    linkUrl: `/uploads/${upload.id}`,
                    isRead: false
                });

                // Emit real-time event
                if (req.io) {
                    req.io.to(`user:${req.user.id}`).emit('new_notification', notification);
                }
            } catch (notifyError) {
                console.error('Notification creation failed:', notifyError);
                // Don't fail the upload just because notification failed
            }

            // Invalidate uploads cache
            await cacheService.delPattern('uploads:*');

            res.status(201).json({
                success: true,
                message: 'File uploaded successfully',
                data: { upload },
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
            });
        }
    },
];

/**
 * @route   GET /api/uploads
 * @desc    Get all uploads with filters
 * @access  Public
 */
export const getUploads = async (req, res) => {
    try {
        const { type, subject, search, page, limit, sortBy, sortOrder } = req.query;

        // Cache Key
        const cacheKey = `uploads:list:${JSON.stringify(req.query)}`;
        const cachedData = await cacheService.get(cacheKey);
        if (cachedData) {
            return res.json({
                success: true,
                data: cachedData,
                fromCache: true
            });
        }

        const result = await Upload.getAll({
            type,
            subject,
            search,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sortBy,
            sortOrder,
        });

        // Store in cache for 5 minutes
        await cacheService.set(cacheKey, result, 300);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Get uploads error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   GET /api/uploads/:id
 * @desc    Get upload by ID
 * @access  Public
 */
export const getUpload = async (req, res) => {
    try {
        const { id } = req.params;

        // Cache Key
        const cacheKey = `uploads:detail:${id}`;
        const cachedData = await cacheService.get(cacheKey);
        if (cachedData) {
            return res.json({
                success: true,
                data: cachedData,
                fromCache: true
            });
        }

        const upload = await Upload.getById(id);

        if (!upload) {
            return res.status(404).json({
                success: false,
                message: 'Upload not found',
            });
        }

        // Store in cache for 1 hour
        await cacheService.set(cacheKey, { upload }, 3600);

        res.json({
            success: true,
            data: { upload },
        });
    } catch (error) {
        console.error('Get upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   GET /api/uploads/user/me
 * @desc    Get current user's uploads
 * @access  Private
 */
export const getMyUploads = async (req, res) => {
    try {
        const { page, limit } = req.query;

        const result = await Upload.getAll({
            userId: req.user.id,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
        });

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Get my uploads error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   PUT /api/uploads/:id
 * @desc    Update upload
 * @access  Private (owner only)
 */
export const updateUpload = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, subject, tags } = req.body;

        const upload = await Upload.update(id, req.user.id, {
            title,
            description,
            subject,
            tags,
        });

        if (!upload) {
            return res.status(404).json({
                success: false,
                message: 'Upload not found or unauthorized',
            });
        }

        // Invalidate cache
        await cacheService.del(`uploads:detail:${id}`);
        await cacheService.delPattern('uploads:list:*');

        res.json({
            success: true,
            message: 'Upload updated successfully',
            data: { upload },
        });
    } catch (error) {
        console.error('Update upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   DELETE /api/uploads/:id
 * @desc    Delete upload
 * @access  Private (owner only)
 */
export const deleteUpload = async (req, res) => {
    try {
        const { id } = req.params;

        const upload = await Upload.delete(id, req.user.id);

        if (!upload) {
            return res.status(404).json({
                success: false,
                message: 'Upload not found or unauthorized',
            });
        }

        // Invalidate cache
        await cacheService.del(`uploads:detail:${id}`);
        await cacheService.delPattern('uploads:list:*');

        res.json({
            success: true,
            message: 'Upload deleted successfully',
        });
    } catch (error) {
        console.error('Delete upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   GET /api/uploads/:id/download
 * @desc    Download file
 * @access  Private
 */
export const downloadFile = async (req, res) => {
    try {
        const { id } = req.params;
        const upload = await Upload.getById(id);

        if (!upload) {
            return res.status(404).json({
                success: false,
                message: 'Upload not found',
            });
        }

        // Track download
        await Upload.trackDownload(id, req.user.id);

        // Send file
        const filePath = path.resolve(upload.file_path);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server',
            });
        }

        res.download(filePath, upload.file_name);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   POST /api/uploads/:id/rate
 * @desc    Rate an upload
 * @access  Private
 */
export const rateUpload = [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().isLength({ max: 500 }),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const { id } = req.params;
            const { rating, comment } = req.body;

            const result = await Upload.addRating(id, req.user.id, rating, comment);

            res.json({
                success: true,
                message: 'Rating submitted successfully',
                data: { rating: result },
            });
        } catch (error) {
            console.error('Rate upload error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
            });
        }
    },
];

/**
 * @route   GET /api/uploads/:id/ratings
 * @desc    Get ratings for upload
 * @access  Public
 */
export const getRatings = async (req, res) => {
    try {
        const { id } = req.params;
        const { page, limit } = req.query;

        const ratings = await Upload.getRatings(id, parseInt(page) || 1, parseInt(limit) || 10);

        res.json({
            success: true,
            data: { ratings },
        });
    } catch (error) {
        console.error('Get ratings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   POST /api/uploads/:id/bookmark
 * @desc    Toggle bookmark
 * @access  Private
 */
export const toggleBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Upload.toggleBookmark(id, req.user.id);

        res.json({
            success: true,
            message: result.bookmarked ? 'Bookmarked' : 'Bookmark removed',
            data: result,
        });
    } catch (error) {
        console.error('Toggle bookmark error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   GET /api/uploads/bookmarks/me
 * @desc    Get user's bookmarks
 * @access  Private
 */
export const getMyBookmarks = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const bookmarks = await Upload.getUserBookmarks(
            req.user.id,
            parseInt(page) || 1,
            parseInt(limit) || 20
        );

        res.json({
            success: true,
            data: { bookmarks },
        });
    } catch (error) {
        console.error('Get bookmarks error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

