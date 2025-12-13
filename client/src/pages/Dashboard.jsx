import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import NotificationBell from '../components/layout/NotificationBell';
import { MessageSquare, Users, LogOut, Upload, BookOpen } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const features = [
        {
            icon: MessageSquare,
            title: 'Direct Messages',
            description: 'Chat privately with other students and teachers',
            link: '/messages',
            color: 'bg-blue-500',
        },
        {
            icon: Users,
            title: 'Anonymous Rooms',
            description: 'Join study groups without revealing your identity',
            link: '/rooms',
            color: 'bg-purple-500',
        },
        {
            icon: Upload,
            title: 'Upload Notes',
            description: 'Share your notes and assignments',
            link: '/upload',
            color: 'bg-green-500',
        },
        {
            icon: BookOpen,
            title: 'Browse Content',
            description: 'Access shared notes and assignments',
            link: '/browse',
            color: 'bg-green-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <NotificationBell />
                            <button
                                onClick={() => navigate('/profile')}
                                className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors cursor-pointer"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {user?.full_name || user?.username}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h2>
                    <p className="text-blue-100">
                        Collaborate, share, and learn with your peers through our comprehensive platform
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Link
                                key={feature.title}
                                to={feature.link}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow group"
                            >
                                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {feature.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
                        <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Role</h4>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                            {user?.role || 'User'}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
                        <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Status</h4>
                        <p className="text-2xl font-bold text-green-600">Active</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
                        <h4 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Account</h4>
                        <p className="text-2xl font-bold text-blue-600">
                            {user?.isVerified ? 'Verified' : 'Pending'}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
