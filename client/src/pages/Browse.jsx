import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Upload as UploadIcon, Filter } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../stores/authStore';
import UploadModal from '../components/uploads/UploadModal';
import UploadCard from '../components/uploads/UploadCard';
import UploadDetailsModal from '../components/uploads/UploadDetailsModal';
import SearchFilters from '../components/search/SearchFilters';

export default function Browse() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedUpload, setSelectedUpload] = useState(null);
    const [filters, setFilters] = useState({});

    // Fetch uploads with filters
    const fetchUploads = async (currentFilters = {}) => {
        setLoading(true);
        try {
            // Convert filters object to query string
            const params = new URLSearchParams();
            Object.entries(currentFilters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            // Use search endpoint which handles standard listing too
            const res = await axios.get(`/api/search?${params.toString()}`);
            setUploads(res.data.data);
        } catch (error) {
            console.error('Error loading content:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchUploads();
    }, []);

    // Handle filter changes (debounced search could be added here)
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        fetchUploads(newFilters);
    };

    const canUpload = isAuthenticated && (user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'student');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Content</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Discover notes, assignments, and study materials
                        </p>
                    </div>
                    {canUpload && (
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105"
                        >
                            <UploadIcon className="w-5 h-5" />
                            Upload Resource
                        </button>
                    )}
                </div>

                {/* Search & Filters */}
                <SearchFilters onFilter={handleFilterChange} />

                {/* Results */}
                <div>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                        </div>
                    ) : uploads.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No uploads found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {uploads.map((upload) => (
                                <UploadCard
                                    key={upload.id}
                                    upload={upload}
                                    onClick={() => setSelectedUpload(upload)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <UploadModal
                    onClose={() => setIsUploadModalOpen(false)}
                    onSuccess={() => {
                        setIsUploadModalOpen(false);
                        fetchUploads(filters);
                    }}
                />
            )}

            {/* Details Modal */}
            {selectedUpload && (
                <UploadDetailsModal
                    upload={selectedUpload}
                    onClose={() => setSelectedUpload(null)}
                    token={localStorage.getItem('token')}
                    currUserId={user?.id}
                />
            )}
        </div>
    );
}



