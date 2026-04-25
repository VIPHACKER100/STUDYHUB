import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// API service functions
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/password', data),
    searchUsers: (query) => api.get(`/auth/search?q=${encodeURIComponent(query)}`),
};

export const messageAPI = {
    getConversations: () => api.get('/messages/conversations'),
    getOrCreateConversation: (userId) => api.get(`/messages/conversation/${userId}`),
    getMessages: (conversationId, page = 1) =>
        api.get(`/messages/${conversationId}?page=${page}`),
    sendMessage: (data) => api.post('/messages/send', data),
    editMessage: (messageId, message) => api.put(`/messages/${messageId}`, { message }),
    deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
    getUnreadCount: () => api.get('/messages/unread/count'),
};

export const roomAPI = {
    getRooms: (type) => api.get(type ? `/rooms?type=${type}` : '/rooms'),
    createRoom: (data) => api.post('/rooms', data),
    getRoom: (roomId) => api.get(`/rooms/${roomId}`),
    joinRoom: (roomId) => api.post(`/rooms/${roomId}/join`),
    leaveRoom: (roomId) => api.post(`/rooms/${roomId}/leave`),
    getRoomMessages: (roomId, page = 1) =>
        api.get(`/rooms/${roomId}/messages?page=${page}`),
    deleteRoom: (roomId) => api.delete(`/rooms/${roomId}`),
};

export const uploadAPI = {
    create: (formData) => api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAll: (params) => api.get('/uploads', { params }), // supports search, filters
    getById: (id) => api.get(`/uploads/${id}`),
    getMyUploads: (params) => api.get('/uploads/user/me', { params }),
    update: (id, data) => api.put(`/uploads/${id}`, data),
    delete: (id) => api.delete(`/uploads/${id}`),
    download: (id) => api.get(`/uploads/${id}/download`, { responseType: 'blob' }),
    rate: (id, data) => api.post(`/uploads/${id}/rate`, data),
    getRatings: (id, params) => api.get(`/uploads/${id}/ratings`, { params }),
    toggleBookmark: (id) => api.post(`/uploads/${id}/bookmark`),
    getMyBookmarks: (params) => api.get('/uploads/bookmarks/me', { params })
};

export const aiAPI = {
    summarize: (uploadId) => api.post(`/ai/summarize/${uploadId}`)
};



