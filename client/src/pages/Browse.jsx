import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Upload as UploadIcon, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../stores/authStore';
import UploadModal from '../components/uploads/UploadModal';
import UploadCard from '../components/uploads/UploadCard';
import UploadDetailsModal from '../components/uploads/UploadDetailsModal';
import SearchFilters from '../components/search/SearchFilters';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export default function Browse() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedUpload, setSelectedUpload] = useState(null);
    const [filters, setFilters] = useState({});

    const fetchUploads = async (currentFilters = {}) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(currentFilters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            const res = await axios.get(`/api/search?${params.toString()}`);
            setUploads(res.data.data);
        } catch (error) {
            console.error('Error loading content:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUploads(); }, []);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        fetchUploads(newFilters);
    };

    const canUpload = isAuthenticated && (user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'student');

    const container = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
    };
    const item = {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-display text-foreground tracking-tight">Knowledge Library</h1>
                            {!loading && uploads.length > 0 && (
                                <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 font-mono">
                                    {uploads.length} resources
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">Discover notes, assignments, and peer study materials</p>
                    </div>
                    {canUpload && (
                        <Button onClick={() => setIsUploadModalOpen(true)} className="rounded-full shadow-lg shadow-accent/20">
                            <UploadIcon className="w-4 h-4 mr-2" />
                            Upload Resource
                        </Button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Search & Filters */}
                <div className="mb-10">
                    <SearchFilters onFilter={handleFilterChange} />
                </div>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {[1,2,3,4,5,6].map(i => (
                                <Card key={i} className="h-52 animate-pulse bg-muted/40 border-none" />
                            ))}
                        </motion.div>
                    ) : uploads.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-32 text-center"
                        >
                            <div className="w-24 h-24 rounded-[2rem] bg-accent/10 flex items-center justify-center mb-8 relative">
                                <div className="absolute inset-0 bg-accent/10 rounded-[2rem] blur-xl" />
                                <BookOpen className="w-12 h-12 text-accent relative z-10" />
                            </div>
                            <h3 className="text-2xl font-display text-foreground mb-3">No resources found</h3>
                            <p className="text-muted-foreground max-w-sm mb-8">
                                Adjust your search filters or be the first to contribute to this topic.
                            </p>
                            {canUpload && (
                                <Button onClick={() => setIsUploadModalOpen(true)} variant="outline" className="rounded-full">
                                    <UploadIcon className="w-4 h-4 mr-2" />
                                    Upload the first resource
                                </Button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            variants={container} initial="hidden" animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {uploads.map((upload) => (
                                <motion.div key={upload.id} variants={item}>
                                    <UploadCard
                                        upload={upload}
                                        onClick={() => setSelectedUpload(upload)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <UploadModal
                        onClose={() => setIsUploadModalOpen(false)}
                        onSuccess={() => { setIsUploadModalOpen(false); fetchUploads(filters); }}
                    />
                )}
            </AnimatePresence>

            {/* Details Modal */}
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




