import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Trophy, Upload, Download, Star, Crown, RefreshCw, Medal, Award } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// ─── API helpers ──────────────────────────────────────────────────────────────

const fetchTopUploaders   = (limit) => axios.get(`/api/leaderboard/uploaders?limit=${limit}`).then(r => r.data.data);
const fetchTopDownloaders = (limit) => axios.get(`/api/leaderboard/downloaders?limit=${limit}`).then(r => r.data.data);
const fetchMyBadges       = (uid)   => axios.get(`/api/leaderboard/badges/${uid}`).then(r => r.data.data);

// ─── Sub-components ───────────────────────────────────────────────────────────

const RankMedal = ({ rank }) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="text-sm font-black text-muted-foreground w-8 text-center">#{rank}</span>;
};

const UserRow = ({ entry, metric, metricLabel }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-default group ${
            entry.rank <= 3
                ? 'bg-accent/5 border-accent/20 hover:border-accent/40'
                : 'bg-background border-border hover:border-foreground/20'
        }`}
    >
        <div className="w-10 flex items-center justify-center flex-shrink-0">
            <RankMedal rank={entry.rank} />
        </div>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center text-foreground font-black text-sm flex-shrink-0 group-hover:scale-105 transition-transform">
            {entry.username.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-foreground truncate">{entry.username}</span>
                <Badge variant="outline" className="text-[10px] font-mono uppercase bg-muted/50">
                    {entry.role}
                </Badge>
                {entry.badge && (
                    <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                        style={{ borderColor: entry.badge.color + '50', background: entry.badge.color + '15', color: entry.badge.color }}
                    >
                        {entry.badge.emoji} {entry.badge.label}
                    </span>
                )}
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {metric(entry)} {metricLabel}
            </p>
        </div>
    </motion.div>
);

const MyBadgesPanel = ({ userId }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['my-badges', userId],
        queryFn: () => fetchMyBadges(userId),
        enabled: !!userId,
        staleTime: 10 * 60 * 1000,
    });

    if (!userId) return null;
    if (isLoading) return (
        <Card className="p-6 animate-pulse h-32" />
    );
    if (!data) return null;

    const categories = ['upload', 'download', 'community'];
    const catLabels  = { upload: '📤 Uploader', download: '📥 Learner', community: '🤝 Community' };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <h2 className="text-base font-display text-foreground">My Badges</h2>
                </div>
                <Badge variant="outline" className="font-mono">{data.total} earned</Badge>
            </div>

            {data.total === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                    Start uploading and downloading to earn badges! 🚀
                </p>
            ) : (
                <div className="space-y-4">
                    {categories.map(cat => {
                        const catBadges = data.badges.filter(b => b.category === cat);
                        if (!catBadges.length) return null;
                        return (
                            <div key={cat}>
                                <p className="text-[10px] font-mono font-black text-muted-foreground uppercase tracking-widest mb-2">{catLabels[cat]}</p>
                                <div className="flex flex-wrap gap-2">
                                    {catBadges.map(badge => (
                                        <span
                                            key={badge.id}
                                            title={badge.description}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border cursor-help"
                                            style={{ borderColor: badge.color + '50', background: badge.color + '15', color: badge.color }}
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

            {/* Stats grid */}
            <div className="mt-5 pt-4 border-t border-border grid grid-cols-3 gap-3 text-center">
                {[
                    { label: 'Uploads',   value: data.stats.uploads,   icon: Upload },
                    { label: 'Downloads', value: data.stats.downloads, icon: Download },
                    { label: 'Reviews',   value: data.stats.ratings,   icon: Star },
                ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-muted/40 rounded-xl p-2.5">
                        <Icon className="w-3.5 h-3.5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-black text-foreground">{value}</p>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase">{label}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
    { id: 'uploaders',   label: 'Top Contributors', icon: Trophy },
    { id: 'downloaders', label: 'Top Learners',     icon: Download },
];

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

    return (
        <div className="min-h-screen bg-background">
            {/* Inverted Hero Header */}
            <div className="bg-foreground">
                <div className="max-w-5xl mx-auto px-6 py-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.2rem] bg-accent/20 border border-accent/30 flex items-center justify-center">
                            <Crown className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display text-white tracking-tight">Leaderboard</h1>
                            <p className="text-muted-foreground text-sm">Top contributors &amp; learners in the StudyHub community</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Rankings Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tab Switcher */}
                        <div className="flex gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border">
                            {TABS.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                        activeTab === id
                                            ? 'bg-foreground text-white shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* List */}
                        <AnimatePresence mode="wait">
                            {activeQuery.isLoading ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Card key={i} className="h-20 animate-pulse bg-muted/40 border-none" />
                                    ))}
                                </motion.div>
                            ) : activeQuery.isError ? (
                                <motion.div key="error" className="text-center py-12 text-muted-foreground text-sm">
                                    Could not load leaderboard. Please try again.
                                </motion.div>
                            ) : activeQuery.data?.length === 0 ? (
                                <motion.div key="empty" className="text-center py-12 text-muted-foreground text-sm">
                                    No entries yet — be the first! 🚀
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="space-y-2"
                                >
                                    {activeQuery.data?.map(entry =>
                                        activeTab === 'uploaders' ? (
                                            <UserRow
                                                key={entry.id}
                                                entry={entry}
                                                metric={e => `${e.uploadCount} uploads · ${e.totalDownloads} downloads`}
                                                metricLabel=""
                                            />
                                        ) : (
                                            <UserRow
                                                key={entry.id}
                                                entry={entry}
                                                metric={e => e.downloadCount}
                                                metricLabel="resources studied"
                                            />
                                        )
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <MyBadgesPanel userId={user?.id} />

                        {/* Badge Tier Legend */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Medal className="w-4 h-4 text-accent" />
                                <h3 className="text-sm font-display text-foreground">Badge Tiers</h3>
                            </div>
                            <div className="space-y-2.5">
                                {[
                                    { emoji: '👑', label: 'Legend',      desc: '50+ uploads' },
                                    { emoji: '🏆', label: 'Expert',      desc: '20+ uploads' },
                                    { emoji: '⭐', label: 'Contributor', desc: '10+ uploads' },
                                    { emoji: '🔥', label: 'Active',      desc: '5+ uploads'  },
                                    { emoji: '🌱', label: 'Newcomer',    desc: '1st upload'  },
                                ].map(t => (
                                    <div key={t.label} className="flex items-center gap-2.5 text-xs">
                                        <span className="text-base w-6 text-center">{t.emoji}</span>
                                        <span className="font-bold text-foreground w-24">{t.label}</span>
                                        <span className="text-muted-foreground font-mono">{t.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
