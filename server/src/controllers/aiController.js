import aiService from '../services/aiService.js';
import Upload from '../models/Upload.js';
import cacheService from '../services/cacheService.js';

/**
 * @route   POST /api/ai/summarize/:uploadId
 * @desc    Generate an AI summary for an upload
 * @access  Private
 */
export const summarizeUpload = async (req, res) => {
    try {
        const { uploadId } = req.params;
        const cacheKey = `ai:summary:${uploadId}`;

        // Check cache
        const cached = await cacheService.get(cacheKey);
        if (cached) return res.json({ success: true, data: cached, fromCache: true });

        const upload = await Upload.getById(uploadId);
        if (!upload) {
            return res.status(404).json({ success: false, message: 'Upload not found' });
        }

        // Only allow summarization for PDF/Text files (basic check)
        if (!upload.file_type.includes('pdf') && !upload.file_type.includes('text')) {
             return res.status(400).json({ success: false, message: 'Summarization is only supported for PDF or text documents' });
        }

        // 1. Extract text
        const text = await aiService.extractText(upload.file_path);
        
        if (!text || text.trim().length < 50) {
            return res.status(400).json({ success: false, message: 'Not enough text content found in document to summarize' });
        }

        // 2. Generate summary
        const summary = await aiService.summarize(text);

        // 3. Cache for 24 hours
        await cacheService.set(cacheKey, { summary }, 86400);

        res.json({
            success: true,
            data: { summary }
        });
    } catch (error) {
        console.error('Summarize controller error:', error);
        res.status(500).json({ success: false, message: error.message || 'Summarization failed' });
    }
};
