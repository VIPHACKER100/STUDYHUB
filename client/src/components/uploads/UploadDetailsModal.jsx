import React, { useState, useEffect } from 'react';
import { X, Download, Bookmark, Calendar, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { uploadAPI } from '../../services/api';
import RatingSection from './RatingSection';
import SummarySection from './SummarySection';

export default function UploadDetailsModal({ upload, onClose, token, currUserId }) {
    const [ratings, setRatings] = useState([]);
    const [loadingRatings, setLoadingRatings] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Fetch ratings and bookmark status on mount
    useEffect(() => {
        fetchRatings();
        // Check bookmark status logic or assume false initiated
    }, [upload.id]);

    const fetchRatings = async () => {
        try {
            setLoadingRatings(true);
            const res = await uploadAPI.getRatings(upload.id);
            setRatings(res.data.data.ratings);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        } finally {
            setLoadingRatings(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await uploadAPI.download(upload.id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', upload.file_name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Download started");
        } catch (error) {
            toast.error("Download failed");
            console.error(error);
        }
    };

    const handleBookmark = async () => {
        try {
            const res = await uploadAPI.toggleBookmark(upload.id);
            setIsBookmarked(res.data.data.bookmarked);
            toast.success(res.data.message);
        } catch (error) {
            toast.error("Failed to bookmark");
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative">

                {/* Close Button (Absolute for mobile) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white md:hidden z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side: Upload Details */}
                <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium uppercase tracking-wider mb-3 inline-block">
                                {upload.type}
                            </span>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                {upload.title}
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{upload.full_name || upload.username}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(upload.created_at), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>{formatFileSize(upload.file_size)}</span>
                            </div>
                        </div>
                        
                        <SummarySection uploadId={upload.id} fileType={upload.file_type} />

                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wider mb-2">Description</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {upload.description || "No description provided."}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wider mb-2">Subject & Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-sm font-medium">
                                    {upload.subject}
                                </span>
                                {upload.tags?.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleDownload}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 font-semibold transition-all hover:scale-[1.02]"
                            >
                                <Download className="w-5 h-5" />
                                Download File
                            </button>
                            <button
                                onClick={handleBookmark}
                                className={`p-3 rounded-xl border-2 transition-colors ${isBookmarked
                                    ? 'border-yellow-400 bg-yellow-50 text-yellow-600'
                                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
                                    }`}
                                title={isBookmarked ? "Remove Bookmark" : "Bookmark this"}
                            >
                                <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-yellow-400' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Ratings & Comments */}
                <div className="md:w-1/2 flex flex-col h-full bg-white dark:bg-gray-800 relative">
                    {/* Close Button Desktop */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 hidden md:block z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <RatingSection
                        uploadId={upload.id}
                        ratings={ratings}
                        onRatingSubmit={fetchRatings}
                    />
                </div>
            </div>
        </div>
    );
}
