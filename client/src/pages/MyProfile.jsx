import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import useAuthStore from '../stores/authStore';
import UploadDetailsModal from '../components/uploads/UploadDetailsModal';

export default function MyProfile() {
    // Skeleton implemented for future phase detailed in task.md
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('uploads'); // uploads, bookmarks, downloads
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUpload, setSelectedUpload] = useState(null);

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'bookmarks'
                ? '/api/uploads/bookmarks/me'
                : '/api/uploads/user/me';

            // Note: downloads history endpoint not yet explicitly created in controller, using placeholders

            const res = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = activeTab === 'bookmarks' ? res.data.data.bookmarks : res.data.data.uploads;
            setItems(data || []);
        } catch (error) {
            console.error(error);
            // toast.error("Failed to load items");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-8">
                <div className="max-w-4xl mx-auto flex items-center gap-6">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.full_name || user?.username}</h1>
                        <p className="text-gray-500 capitalize">{user?.role} • Joined {new Date().getFullYear()}</p>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                    <button
                        onClick={() => setActiveTab('uploads')}
                        className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'uploads'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        My Uploads
                        {activeTab === 'uploads' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('bookmarks')}
                        className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'bookmarks'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Bookmarks
                        {activeTab === 'bookmarks' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            {activeTab === 'uploads' ? <BookOpen className="w-8 h-8 text-gray-400" /> : <AlertTriangle className="w-8 h-8 text-gray-400" />}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No items found</h3>
                        <p className="text-gray-500">You haven't {activeTab === 'uploads' ? 'uploaded' : 'bookmarked'} anything yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map(item => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedUpload(item)}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                                        {item.file_type?.includes('pdf') ? '📄' : '📝'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.subject} • {format(new Date(item.created_at || Date.now()), 'MMM d, yyyy')}</p>
                                    </div>
                                </div>
                                {activeTab === 'bookmarks' && (
                                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Bookmarked</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
