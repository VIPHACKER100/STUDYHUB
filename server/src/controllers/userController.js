import User from '../models/User.js';
import Upload from '../models/Upload.js';

export const getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Return public info
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    fullName: user.full_name,
                    avatarUrl: user.avatar_url,
                    bio: user.bio, // user.bio doesn't exist in findByUsername select? wait, let me check
                    isVerified: user.is_verified,
                    createdAt: user.created_at
                }
            }
        });
    } catch (error) {
        console.error('Get public profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getUserUploads = async (req, res) => {
    try {
        const { username } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const result = await Upload.getAll({
            userId: user.id,
            privacy: 'public',
            page: parseInt(page),
            limit: parseInt(limit)
        });

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Get user uploads error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

