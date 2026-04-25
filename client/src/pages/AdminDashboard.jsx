import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, MessageSquare, AlertTriangle, LayoutDashboard, BarChart2, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import UserManagement from '../components/admin/UserManagement';
import ReportManagement from '../components/admin/ReportManagement';
import ContentManagement from '../components/admin/ContentManagement';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const TABS = [
    { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'users',     label: 'Users',     icon: Users },
    { id: 'content',   label: 'Content',   icon: FileText },
    { id: 'reports',   label: 'Reports',   icon: AlertTriangle },
];

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

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-accent animate-pulse" />
                </div>
                <p className="text-muted-foreground text-sm font-mono uppercase tracking-widest">Loading admin panel...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Inverted Hero Header */}
            <div className="bg-foreground">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-display text-white tracking-tight">Command Centre</h1>
                            <p className="text-muted-foreground text-sm">Platform administration & analytics</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border bg-background sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
                    <div className="flex items-center gap-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2 px-5 py-4 text-sm font-bold transition-colors whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'text-accent'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="admin-tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-10"
                        >
                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="Total Users"     value={stats?.counts.users}          icon={Users}         accent="accent" />
                                <StatCard title="Total Uploads"   value={stats?.counts.uploads}        icon={FileText}      accent="green-500" />
                                <StatCard title="Messages Sent"   value={stats?.counts.messages}       icon={MessageSquare} accent="accent-secondary" />
                                <StatCard title="Pending Reports" value={stats?.counts.pendingReports} icon={AlertTriangle}  accent="red-400" />
                            </div>

                            {/* Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                        <h2 className="text-lg font-display text-foreground tracking-tight">Recent Users</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {stats?.recentActivity.users.map(user => (
                                            <div key={user.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                                                <div>
                                                    <p className="font-bold text-foreground">{user.username}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{user.email}</p>
                                                </div>
                                                <Badge variant="outline" className="text-xs font-mono uppercase bg-muted/50">
                                                    {user.role}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                        <h2 className="text-lg font-display text-foreground tracking-tight">Recent Uploads</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {stats?.recentActivity.uploads.map(upload => (
                                            <div key={upload.id} className="flex items-center justify-between py-3 border-b border-border last:border-0 gap-4">
                                                <div className="min-w-0">
                                                    <p className="font-bold text-foreground truncate">{upload.title}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{new Date(upload.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs font-mono uppercase flex-shrink-0 ${
                                                        upload.type === 'notes'
                                                            ? 'bg-accent/5 text-accent border-accent/20'
                                                            : 'bg-accent-secondary/5 text-accent-secondary border-accent-secondary/20'
                                                    }`}
                                                >
                                                    {upload.type}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                            <AnalyticsTab stats={stats} />
                        </motion.div>
                    )}

                    {activeTab === 'users' && (
                        <motion.div key="users" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                            <UserManagement />
                        </motion.div>
                    )}

                    {activeTab === 'content' && (
                        <motion.div key="content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                            <ContentManagement />
                        </motion.div>
                    )}

                    {activeTab === 'reports' && (
                        <motion.div key="reports" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                            <ReportManagement />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, accent }) {
    return (
        <Card className="p-6 group hover:border-accent/20 transition-colors">
            <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] font-mono font-black text-muted-foreground uppercase tracking-widest">{title}</p>
                <div className={`w-9 h-9 rounded-xl bg-${accent}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-4 h-4 text-${accent}`} />
                </div>
            </div>
            <p className="text-3xl font-black text-foreground">{value ?? '—'}</p>
        </Card>
    );
}

