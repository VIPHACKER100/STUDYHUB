import { query } from '../config/database.js';
import cacheService from '../services/cacheService.js';

/**
 * @route  GET /api/leaderboard/uploaders
 * @desc   Top users ranked by upload count and total downloads
 * @access Public
 */
export const getTopUploaders = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const cacheKey = `leaderboard:uploaders:${limit}`;

        const cached = await cacheService.get(cacheKey);
        if (cached) return res.json({ success: true, data: cached, fromCache: true });

        const result = await query(`
            SELECT
                u.id,
                u.username,
                u.role,
                COUNT(up.id)                          AS upload_count,
                COALESCE(SUM(up.download_count), 0)   AS total_downloads,
                COALESCE(AVG(up.average_rating), 0)   AS avg_rating,
                MAX(up.created_at)                    AS last_upload
            FROM users u
            JOIN uploads up ON up.user_id = u.id AND up.is_deleted = FALSE
            GROUP BY u.id, u.username, u.role
            ORDER BY upload_count DESC, total_downloads DESC
            LIMIT $1
        `, [parseInt(limit)]);

        const data = result.rows.map((row, i) => ({
            rank: i + 1,
            id: row.id,
            username: row.username,
            role: row.role,
            uploadCount: parseInt(row.upload_count),
            totalDownloads: parseInt(row.total_downloads),
            avgRating: parseFloat(parseFloat(row.avg_rating).toFixed(1)),
            lastUpload: row.last_upload,
            badge: getBadge(parseInt(row.upload_count)),
        }));

        await cacheService.set(cacheKey, data, 300); // 5 min TTL
        res.json({ success: true, data });
    } catch (error) {
        console.error('Leaderboard uploaders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @route  GET /api/leaderboard/downloaders
 * @desc   Top users ranked by content they've downloaded (most active learners)
 * @access Private
 */
export const getTopDownloaders = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const cacheKey = `leaderboard:downloaders:${limit}`;

        const cached = await cacheService.get(cacheKey);
        if (cached) return res.json({ success: true, data: cached, fromCache: true });

        const result = await query(`
            SELECT
                u.id,
                u.username,
                u.role,
                COUNT(d.id) AS download_count
            FROM users u
            JOIN downloads d ON d.user_id = u.id
            GROUP BY u.id, u.username, u.role
            ORDER BY download_count DESC
            LIMIT $1
        `, [parseInt(limit)]);

        const data = result.rows.map((row, i) => ({
            rank: i + 1,
            id: row.id,
            username: row.username,
            role: row.role,
            downloadCount: parseInt(row.download_count),
            badge: getLearnerBadge(parseInt(row.download_count)),
        }));

        await cacheService.set(cacheKey, data, 300);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Leaderboard downloaders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @route  GET /api/leaderboard/badges/:userId
 * @desc   Get a user's earned badges
 * @access Public
 */
export const getUserBadges = async (req, res) => {
    try {
        const { userId } = req.params;
        const cacheKey = `badges:user:${userId}`;

        const cached = await cacheService.get(cacheKey);
        if (cached) return res.json({ success: true, data: cached, fromCache: true });

        const [uploads, downloads, ratings] = await Promise.all([
            query(`SELECT COUNT(*) FROM uploads WHERE user_id = $1 AND is_deleted = FALSE`, [userId]),
            query(`SELECT COUNT(*) FROM downloads WHERE user_id = $1`, [userId]),
            query(`SELECT COUNT(*) FROM upload_ratings WHERE user_id = $1`, [userId]),
        ]);

        const uploadCount   = parseInt(uploads.rows[0].count);
        const downloadCount = parseInt(downloads.rows[0].count);
        const ratingCount   = parseInt(ratings.rows[0].count);

        const badges = computeBadges(uploadCount, downloadCount, ratingCount);

        await cacheService.set(cacheKey, badges, 600); // 10 min TTL
        res.json({ success: true, data: badges });
    } catch (error) {
        console.error('Badges error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── Badge Logic ──────────────────────────────────────────────────────────

function getBadge(uploadCount) {
    if (uploadCount >= 50) return { id: 'legend',       label: 'Legend',         emoji: '👑', color: '#f59e0b' };
    if (uploadCount >= 20) return { id: 'expert',       label: 'Expert',         emoji: '🏆', color: '#6366f1' };
    if (uploadCount >= 10) return { id: 'contributor',  label: 'Contributor',    emoji: '⭐', color: '#22d3ee' };
    if (uploadCount >= 5)  return { id: 'active',       label: 'Active',         emoji: '🔥', color: '#34d399' };
    if (uploadCount >= 1)  return { id: 'newcomer',     label: 'Newcomer',       emoji: '🌱', color: '#94a3b8' };
    return null;
}

function getLearnerBadge(downloadCount) {
    if (downloadCount >= 100) return { id: 'scholar',   label: 'Scholar',        emoji: '📚', color: '#8b5cf6' };
    if (downloadCount >= 50)  return { id: 'studious',  label: 'Studious',       emoji: '📖', color: '#6366f1' };
    if (downloadCount >= 20)  return { id: 'curious',   label: 'Curious',        emoji: '🔍', color: '#22d3ee' };
    if (downloadCount >= 5)   return { id: 'learner',   label: 'Learner',        emoji: '✏️', color: '#34d399' };
    return null;
}

function computeBadges(uploads, downloads, ratings) {
    const earned = [];

    // Upload badges
    if (uploads >= 1)  earned.push({ id: 'newcomer',    label: 'Newcomer',      emoji: '🌱', category: 'upload', description: 'Uploaded your first file' });
    if (uploads >= 5)  earned.push({ id: 'active',      label: 'Active Sharer', emoji: '🔥', category: 'upload', description: 'Uploaded 5+ files' });
    if (uploads >= 10) earned.push({ id: 'contributor', label: 'Contributor',   emoji: '⭐', category: 'upload', description: 'Uploaded 10+ files' });
    if (uploads >= 20) earned.push({ id: 'expert',      label: 'Expert',        emoji: '🏆', category: 'upload', description: 'Uploaded 20+ files' });
    if (uploads >= 50) earned.push({ id: 'legend',      label: 'Legend',        emoji: '👑', category: 'upload', description: 'Uploaded 50+ files' });

    // Download badges
    if (downloads >= 5)   earned.push({ id: 'learner',  label: 'Learner',       emoji: '✏️', category: 'download', description: 'Downloaded 5+ resources' });
    if (downloads >= 20)  earned.push({ id: 'curious',  label: 'Curious Mind',  emoji: '🔍', category: 'download', description: 'Downloaded 20+ resources' });
    if (downloads >= 50)  earned.push({ id: 'studious', label: 'Studious',      emoji: '📖', category: 'download', description: 'Downloaded 50+ resources' });
    if (downloads >= 100) earned.push({ id: 'scholar',  label: 'Scholar',       emoji: '📚', category: 'download', description: 'Downloaded 100+ resources' });

    // Rating badges
    if (ratings >= 1)  earned.push({ id: 'reviewer',    label: 'Reviewer',      emoji: '💬', category: 'community', description: 'Left your first review' });
    if (ratings >= 10) earned.push({ id: 'critic',      label: 'Critic',        emoji: '🎯', category: 'community', description: 'Left 10+ reviews' });

    return {
        total: earned.length,
        badges: earned,
        stats: { uploads, downloads, ratings },
    };
}

