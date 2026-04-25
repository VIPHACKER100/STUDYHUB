import React, { useState, useEffect } from 'react';
import { Users, FileText, MessageSquare, AlertTriangle, LayoutDashboard, Settings } from 'lucide-react';
import axios from 'axios';
import UserManagement from '../components/admin/UserManagement';
import ReportManagement from '../components/admin/ReportManagement';

import ContentManagement from '../components/admin/ContentManagement';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/admin/stats');
                setStats(res.data.data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'reports', label: 'Reports', icon: AlertTriangle },
    ];

    if (loading) return <div className="p-8 text-center text-gray-500">Loading admin panel...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage users, content, and platform settings</p>
            </header>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Users"
                            value={stats?.counts.users}
                            icon={Users}
                            color="blue"
                        />
                        <StatCard
                            title="Total Uploads"
                            value={stats?.counts.uploads}
                            icon={FileText}
                            color="green"
                        />
                        <StatCard
                            title="Messages"
                            value={stats?.counts.messages}
                            icon={MessageSquare}
                            color="purple"
                        />
                        <StatCard
                            title="Pending Reports"
                            value={stats?.counts.pendingReports}
                            icon={AlertTriangle}
                            color="red"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Activity lists logic */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Users</h2>
                            <div className="space-y-4">
                                {stats?.recentActivity.users.map(user => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Uploads</h2>
                            <div className="space-y-4">
                                {stats?.recentActivity.uploads.map(upload => (
                                    <div key={upload.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">{upload.title}</p>
                                            <p className="text-xs text-gray-500">{new Date(upload.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${upload.type === 'notes' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {upload.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="animate-in fade-in duration-300">
                    <UserManagement />
                </div>
            )}

            {activeTab === 'content' && (
                <div className="animate-in fade-in duration-300">
                    <ContentManagement />
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="animate-in fade-in duration-300">
                    <ReportManagement />
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
        red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
