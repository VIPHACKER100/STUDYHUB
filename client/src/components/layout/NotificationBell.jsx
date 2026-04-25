import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import useNotificationStore from '../../stores/notificationStore';
import socketService from '../../services/socket';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        notifications,
        unreadCount,
        fetchNotifications,
        addNotification,
        markAsRead,
        markAllDetailRead
    } = useNotificationStore();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();

        // Listen for real-time notifications
        socketService.socket?.on('new_notification', (notification) => {
            addNotification(notification);
            // Optional: Play sound
        });

        return () => {
            socketService.socket?.off('new_notification');
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        setIsOpen(false);

        if (notification.link_url) {
            navigate(notification.link_url);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllDetailRead}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            <div>
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.is_read ? 'bg-blue-500' : 'bg-transparent'
                                                }`} />

                                            <div className="flex-1">
                                                <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {format(new Date(notification.created_at), 'MMM d, HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
