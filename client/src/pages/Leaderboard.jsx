import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Trophy, Upload, Download, Star, Crown, RefreshCw, Medal, Award } from 'lucide-react';
import useAuthStore from '../stores/authStore';

// ─── API helpers ──────────────────────────────────────────────────────────────

const fetchTopUploaders = async (limit) => {
    const res = await axios.get(`/api/leaderboard/uploaders?limit=${limit}`);
    return res.data.data;
};

const fetchTopDownloaders = async (limit) => {
    const res = await axios.get(`/api/leaderboard/downloaders?limit=${limit}`);
    return res.data.data;
};

const fetchMyBadges = async (userId) => {
    if (!userId) return null;
    const res = await axios.get(`/api/leaderboard/badges/${userId}`);
    return res.data.data;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const RankMedal = ({ rank }) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="text-lg font-bold text-gray-400 dark:text-gray-500 w-8 text-center">#{rank}</span>;
};

const BadgeChip = ({ badge }) => (
    <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
        style={{ borderColor: badge.color + '60', backgroundColor: badge.color + '18', color: badge.color }}
    >
        <span>{badge.emoji}</span>
        {badge.label}
    </span>
);

const UploaderRow = ({ entry }) => (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        entry.rank <= 3
            ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200/60 dark:border-amber-700/30'
            : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
    } hover:shadow-md`}>
        <div className="w-10 flex items-center justify-center flex-shrink-0">
            <RankMedal rank={entry.rank} />
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {entry.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 dark:text-white truncate">{entry.username}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    entry.role === 'teacher' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                    entry.role === 'admin'   ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>{entry.role}</span>
                {entry.badge && <BadgeChip badge={entry.badge} />}
            </div>
            <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Upload className="w-3 h-3" /> {entry.uploadCount} uploads
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Download className="w-3 h-3" /> {entry.totalDownloads} downloads
                </span>
                {entry.avgRating > 0 && (
                    <span className="flex items-center gap-1 text-xs text-amber-500">
                        <Star className="w-3 h-3 fill-current" /> {entry.avgRating}
                    </span>
                )}
            </div>
        </div>
    </div>
);

const DownloaderRow = ({ entry }) => (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        entry.rank <= 3
            ? 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border border-purple-200/60 dark:border-purple-700/30'
            : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
    } hover:shadow-md`}>
        <div className="w-10 flex items-center justify-center flex-shrink-0">
            <RankMedal rank={entry.rank} />
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {entry.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 dark:text-white">{entry.username}</span>
                {entry.badge && <BadgeChip badge={entry.badge} />}
            </div>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                <Download className="w-3 h-3" /> {entry.downloadCount} resources studied
            </span>
        </div>
    </div>
);

const MyBadgesPanel = ({ userId }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['my-badges', userId],
        queryFn: () => fetchMyBadges(userId),
        enabled: !!userId,
        staleTime: 10 * 60 * 1000,
    });

    if (!userId) return null;
    if (isLoading) return <div className="text-center text-gray-400 py-6 text-sm">Loading your badges...</div>;
    if (!data) return null;

    const categories = ['upload', 'download', 'community'];
    const catLabels = { upload: '📤 Uploader', download: '📥 Learner', community: '🤝 Community' };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" /> My Badges
                </h2>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {data.total} earned
                </span>
            </div>

            {data.total === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Start uploading and downloading to earn badges! 🚀
                </p>
            ) : (
                <div className="space-y-4">
                    {categories.map(cat => {
                        const catBadges = data.badges.filter(b => b.category === cat);
                        if (!catBadges.length) return null;
                        return (
                            <div key={cat}>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{catLabels[cat]}</p>
                                <div className="flex flex-wrap gap-2">
                                    {catBadges.map(badge => (
                                        <span
                                            key={badge.id}
                                            title={badge.description}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/40 cursor-help"
                                        >
                                            {badge.emoji} {badge.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Progress stats */}
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-3 text-center">
                {[
                    { label: 'Uploads', value: data.stats.uploads, icon: Upload },
                    { label: 'Downloads', value: data.stats.downloads, icon: Download },
                    { label: 'Reviews', value: data.stats.ratings, icon: Star },
                ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2">
                        <Icon className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Leaderboard() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('uploaders');
    const limit = 15;

    const uploaders = useQuery({
        queryKey: ['leaderboard-uploaders', limit],
        queryFn: () => fetchTopUploaders(limit),
        staleTime: 5 * 60 * 1000,
    });

    const downloaders = useQuery({
        queryKey: ['leaderboard-downloaders', limit],
        queryFn: () => fetchTopDownloaders(limit),
        staleTime: 5 * 60 * 1000,
        enabled: activeTab === 'downloaders',
    });

    const activeQuery = activeTab === 'uploaders' ? uploaders : downloaders;

    const tabs = [
        { id: 'uploaders',   label: 'Top Contributors', icon: Trophy },
        { id: 'downloaders', label: 'Top Learners',      icon: Download },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-lg">
                        <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Recognizing the top contributors and learners in the StudyHub community
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Rankings panel */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Tabs */}
                        <div className="flex gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
                            {tabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        activeTab === id
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* List */}
                        <div className="space-y-2">
                            {activeQuery.isLoading && (
                                <div className="flex items-center justify-center py-16 text-gray-400">
                                    <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading rankings...
                                </div>
                            )}
                            {activeQuery.isError && (
                                <div className="text-center py-12 text-red-500 text-sm">
                                    Could not load leaderboard. Please try again.
                                </div>
                            )}
                            {activeQuery.data?.length === 0 && (
                                <div className="text-center py-12 text-gray-400 text-sm">
                                    No entries yet — be the first! 🚀
                                </div>
                            )}
                            {activeQuery.data?.map(entry =>
                                activeTab === 'uploaders'
                                    ? <UploaderRow key={entry.id} entry={entry} />
                                    : <DownloaderRow key={entry.id} entry={entry} />
                            )}
                        </div>
                    </div>

                    {/* Sidebar — My Badges */}
                    <div>
                        <MyBadgesPanel userId={user?.id} />

                        {/* Legend */}
                        <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                <Medal className="w-4 h-4 text-amber-500" /> Badge Tiers
                            </h3>
                            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                                {[
                                    { emoji: '👑', label: 'Legend',      desc: '50+ uploads' },
                                    { emoji: '🏆', label: 'Expert',      desc: '20+ uploads' },
                                    { emoji: '⭐', label: 'Contributor', desc: '10+ uploads' },
                                    { emoji: '🔥', label: 'Active',      desc: '5+ uploads' },
                                    { emoji: '🌱', label: 'Newcomer',    desc: '1st upload' },
                                ].map(t => (
                                    <div key={t.label} className="flex items-center gap-2">
                                        <span className="text-base">{t.emoji}</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300 w-24">{t.label}</span>
                                        <span>{t.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



