import { create } from 'zustand';
import axios from 'axios';
import socketService from '../services/socket';

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,

    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const response = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            set({
                notifications: response.data.data.notifications,
                unreadCount: response.data.data.unreadCount,
                loading: false
            });
        } catch (error) {
            console.error('Fetch notifications error:', error);
            set({ loading: false });
        }
    },

    addNotification: (notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }));
    },

    markAsRead: async (id) => {
        try {
            await axios.put(`/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, is_read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch (error) {
            console.error('Mark read error:', error);
        }
    },

    markAllDetailRead: async () => {
        try {
            await axios.put('/api/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, is_read: true })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error('Mark all read error:', error);
        }
    }
}));

export default useNotificationStore;
