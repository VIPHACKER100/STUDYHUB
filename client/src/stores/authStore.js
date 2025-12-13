import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import socketService from '../services/socket';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            // Login
            login: async (email, password) => {
                set({ loading: true, error: null });
                try {
                    const response = await authAPI.login({ email, password });
                    const { user, token } = response.data.data;

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        loading: false,
                    });

                    // Store token
                    localStorage.setItem('token', token);

                    // Connect socket
                    socketService.connect(token);

                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.message || 'Login failed';
                    set({ error: message, loading: false });
                    return { success: false, error: message };
                }
            },

            // Register
            register: async (userData) => {
                set({ loading: true, error: null });
                try {
                    const response = await authAPI.register(userData);
                    const { user, token } = response.data.data;

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        loading: false,
                    });

                    localStorage.setItem('token', token);
                    socketService.connect(token);

                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.message || 'Registration failed';
                    set({ error: message, loading: false });
                    return { success: false, error: message };
                }
            },

            // Logout
            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                socketService.disconnect();

                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            // Initialize auth (on app load)
            initialize: async () => {
                const token = localStorage.getItem('token');

                if (token) {
                    try {
                        const response = await authAPI.getMe();
                        const user = response.data.data.user;

                        set({
                            user,
                            token,
                            isAuthenticated: true,
                        });

                        socketService.connect(token);
                    } catch (error) {
                        // Token invalid, clear auth
                        get().logout();
                    }
                }
            },

            // Update profile
            updateProfile: async (data) => {
                try {
                    const response = await authAPI.updateProfile(data);
                    const user = response.data.data.user;

                    set({ user });
                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.message || 'Update failed';
                    return { success: false, error: message };
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
