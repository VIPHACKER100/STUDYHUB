import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ArrowLeft, BookOpen, Calendar, MessageSquare, Shield, FileText, Download, Star } from 'lucide-react';
import { format } from 'date-fns';
import useAuthStore from '../stores/authStore';
import UploadDetailsModal from '../components/uploads/UploadDetailsModal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export default function PublicProfile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUpload, setSelectedUpload] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const [profileRes, uploadsRes] = await Promise.all([
                    axios.get(`/api/users/${username}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }),
                    axios.get(`/api/users/${username}/uploads`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }),
                ]);
                setProfile(profileRes.data.data.user);
                setUploads(uploadsRes.data.data.uploads || []);
            } catch (err) {
                console.error('Failed to load profile:', err);
            } finally {
                setLoading(false);
            }
        };
        if (username) fetchProfile();
    }, [username]);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center animate-pulse">
                <BookOpen className="w-5 h-5 text-accent" />
            </div>
        </div>
    );

    if (!profile) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
            <p className="text-foreground font-display text-xl">User not found</p>
            <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header */}
            <div className="bg-foreground">
                <div className="max-w-4xl mx-auto px-6 pt-8 pb-12">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="rounded-full w-10 h-10 p-0 mb-8 text-muted-foreground hover:text-white hover:bg-white/10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 rounded-[1.5rem] bg-accent/20 border border-accent/30 flex items-center justify-center shadow-xl shadow-accent/20">
                                {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt={profile.username}
                                        className="w-full h-full rounded-[1.5rem] object-cover" />
                                ) : (
                                    <span className="text-4xl font-black text-white uppercase">
                                        {profile.username[0]}
                                    </span>
                                )}
                            </div>
                            {profile.role === 'teacher' && (
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent rounded-xl flex items-center justify-center shadow-sm">
                                    <Shield className="w-3.5 h-3.5 text-foreground" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-display text-white mb-2">
                                {profile.fullName || profile.username}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap mb-4">
                                <Badge variant="outline" className="bg-white/5 border-white/10 text-white/70 font-mono uppercase">
                                    {profile.role}
                                </Badge>
                                <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Joined {new Date(profile.createdAt).getFullYear()}
                                </span>
                            </div>

                            {profile.bio && (
                                <p className="text-muted-foreground text-sm max-w-lg mb-5">{profile.bio}</p>
                            )}

                            {currentUser?.id !== profile.id && (
                                <Button
                                    onClick={() => navigate('/messages')}
                                    variant="outline"
                                    className="border-white/20 text-white hover:bg-white/10"
                                    size="sm"
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Message
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Uploads Section */}
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <h2 className="text-lg font-display text-foreground">
                        Uploads
                        <span className="ml-2 text-muted-foreground font-mono text-sm">({uploads.length})</span>
                    </h2>
                </div>

                <AnimatePresence mode="wait">
                    {uploads.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 bg-accent/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 relative">
                                <div className="absolute inset-0 bg-accent/10 rounded-[1.5rem] blur-xl" />
                                <BookOpen className="w-10 h-10 text-accent relative z-10" />
                            </div>
                            <h3 className="text-lg font-display text-foreground mb-2">No uploads yet</h3>
                            <p className="text-muted-foreground text-sm">This user hasn't shared any study materials.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {uploads.map(upload => (
                                <Card
                                    key={upload.id}
                                    onClick={() => setSelectedUpload(upload)}
                                    className="p-5 cursor-pointer hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <FileText className="w-5 h-5 text-accent" />
                                        </div>
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            {format(new Date(upload.created_at), 'MMM d, yyyy')}
                                        </Badge>
                                    </div>
                                    <h3 className="font-bold text-foreground mb-1 group-hover:text-accent transition-colors line-clamp-1">
                                        {upload.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-mono mb-4 line-clamp-1">
                                        {upload.subject}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                                        <span className="flex items-center gap-1">
                                            <Download className="w-3 h-3" />
                                            {upload.download_count}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            {Number(upload.average_rating || 0).toFixed(1)}
                                        </span>
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
                        currUserId={currentUser?.id}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
