import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, BookOpen, Bookmark, Clock, AlertTriangle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import useAuthStore from '../stores/authStore';
import UploadDetailsModal from '../components/uploads/UploadDetailsModal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const TABS = [
    { id: 'uploads',   label: 'My Uploads',  icon: FileText },
    { id: 'bookmarks', label: 'Bookmarks',    icon: Bookmark },
];

export default function MyProfile() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('uploads');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUpload, setSelectedUpload] = useState(null);

    useEffect(() => { fetchItems(); }, [activeTab]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'bookmarks'
                ? '/api/uploads/bookmarks/me'
                : '/api/uploads/user/me';
            const res = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.data?.success && res.data?.data) {
                const data = activeTab === 'bookmarks' ? res.data.data.bookmarks : res.data.data.uploads;
                setItems(Array.isArray(data) ? data : []);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error('Fetch items error:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const memberYear = user?.created_at
        ? new Date(user.created_at).getFullYear()
        : new Date().getFullYear();

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header — Inverted */}
            <div className="bg-foreground">
                <div className="max-w-4xl mx-auto px-6 pt-8 pb-12">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard')}
                        className="rounded-full w-10 h-10 p-0 mb-8 text-muted-foreground hover:text-white hover:bg-white/10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-accent/20 border border-accent/30 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-accent/20">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-foreground" />
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl font-display text-white mb-1">
                                {user?.full_name || user?.username}
                            </h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                <Badge variant="outline" className="bg-white/5 border-white/10 text-white/70 font-mono uppercase">
                                    {user?.role}
                                </Badge>
                                <span className="text-muted-foreground text-sm">Member since {memberYear}</span>
                                {user?.is_verified && (
                                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                                        Verified
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border bg-background sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center gap-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2 px-5 py-4 text-sm font-bold transition-colors ${
                                    activeTab === tab.id
                                        ? 'text-accent'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="profile-tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-10">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            {[1, 2, 3].map(i => (
                                <Card key={i} className="h-20 animate-pulse bg-muted/40 border-none" />
                            ))}
                        </motion.div>
                    ) : items.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="text-center py-24"
                        >
                            <div className="w-20 h-20 bg-accent/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 relative">
                                <div className="absolute inset-0 bg-accent/10 rounded-[1.5rem] blur-xl" />
                                {activeTab === 'uploads'
                                    ? <BookOpen className="w-10 h-10 text-accent relative z-10" />
                                    : <Bookmark className="w-10 h-10 text-accent relative z-10" />
                                }
                            </div>
                            <h3 className="text-xl font-display text-foreground mb-2">Nothing here yet</h3>
                            <p className="text-muted-foreground">
                                You haven't {activeTab === 'uploads' ? 'uploaded any resources' : 'bookmarked anything'} yet.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-3"
                        >
                            {items.map(item => (
                                <Card
                                    key={item.id}
                                    onClick={() => setSelectedUpload(item)}
                                    className="p-5 cursor-pointer hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 group"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                                                {item.file_type?.includes('pdf') ? '📄' : '📝'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground font-mono">
                                                    {item.subject} · {format(new Date(item.created_at || Date.now()), 'MMM d, yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                        {activeTab === 'bookmarks' && (
                                            <Badge variant="outline" className="bg-accent-secondary/5 text-accent-secondary border-accent-secondary/20 flex-shrink-0">
                                                Saved
                                            </Badge>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {selectedUpload && (
                    <UploadDetailsModal
                        upload={selectedUpload}
                        onClose={() => setSelectedUpload(null)}
                        token={localStorage.getItem('token')}
                        currUserId={user?.id}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

