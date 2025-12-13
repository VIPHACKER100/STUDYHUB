import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await Notification.getForUser(
            req.user.id,
            parseInt(page) || 1,
            parseInt(limit) || 20
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.markAsRead(id, req.user.id);

        res.json({
            success: true,
            message: 'Marked as read',
        });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

export const markAllRead = async (req, res) => {
    try {
        await Notification.markAllAsRead(req.user.id);
        res.json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.delete(id, req.user.id);
        res.json({
            success: true,
            message: 'Notification deleted',
        });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
