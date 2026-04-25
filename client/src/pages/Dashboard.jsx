import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import {
    MessageSquare, Users, Upload, BookOpen,
    Trophy, Search, Bell, TrendingUp
} from 'lucide-react';

const features = [
    {
        icon: BookOpen,
        title: 'Browse Notes',
        description: 'Access shared notes and assignments from peers',
        link: '/browse',
        gradient: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
        icon: MessageSquare,
        title: 'Direct Messages',
        description: 'Chat privately with students and teachers',
        link: '/messages',
        gradient: 'from-violet-500 to-purple-600',
        bg: 'bg-violet-50 dark:bg-violet-900/20',
    },
    {
        icon: Users,
        title: 'Anonymous Rooms',
        description: 'Join study groups without revealing your identity',
        link: '/rooms',
        gradient: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
        icon: Trophy,
        title: 'Leaderboard',
        description: 'See top contributors and earn achievement badges',
        link: '/leaderboard',
        gradient: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
];

export default function Dashboard() {
    const { user } = useAuthStore();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 mb-10 shadow-xl">
                {/* decorative circles */}
                <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                    <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back,</p>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {user?.full_name || user?.username} 👋
                    </h1>
                    <p className="text-indigo-200 max-w-lg">
                        Your collaborative study space — share knowledge, chat with peers, and climb the rankings.
                    </p>

                    <div className="flex items-center gap-4 mt-6 flex-wrap">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl px-4 py-2">
                            <span className="text-white text-sm font-semibold capitalize">{user?.role}</span>
                        </div>
                        {user?.is_verified && (
                            <div className="flex items-center gap-2 bg-green-400/20 backdrop-blur rounded-xl px-4 py-2">
                                <span className="text-green-300 text-sm font-semibold">✓ Verified</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Feature Cards Grid */}
            <section className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map(({ icon: Icon, title, description, link, gradient, bg }) => (
                        <Link
                            key={title}
                            to={link}
                            className={`group relative overflow-hidden ${bg} rounded-2xl p-6 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-700/40 hover:shadow-lg transition-all duration-300`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Open →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Stats Row */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Platform Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Your Role',   value: user?.role || '—',      icon: TrendingUp, color: 'text-indigo-600' },
                        { label: 'Status',      value: 'Active',               icon: Bell,       color: 'text-green-500' },
                        { label: 'Account',     value: user?.is_verified ? 'Verified' : 'Pending', icon: Search, color: 'text-amber-500' },
                        { label: 'Member Since', value: user?.created_at
                            ? new Date(user.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })
                            : '—',                                               icon: Trophy,  color: 'text-purple-600' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
                                <Icon className={`w-4 h-4 ${color}`} />
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">{value}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
