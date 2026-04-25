import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen, Calendar, MessageSquare, Shield, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import useAuthStore from '../stores/authStore';
import UploadDetailsModal from '../components/uploads/UploadDetailsModal';

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
                // Fetch user profile
                const profileRes = await axios.get(`/api/users/${username}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setProfile(profileRes.data.data.user);

                // Fetch user uploads
                const uploadsRes = await axios.get(`/api/users/${username}/uploads`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUploads(uploadsRes.data.data.uploads || []);

            } catch (error) {
                console.error('Failed to load profile:', error);
                // Optionally redirect to 404
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchProfile();
    }, [username]);

    const handleMessage = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        if (currentUser.id === profile.id) return;

        // Navigate to messages with this user selected
        // We'll need to implement a way to start conversation via navigate state or query param
        // For now, let's just go to messages
        navigate('/messages');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">User not found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header / Cover */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <button onClick={() => navigate(-1)} className="mb-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                {profile.avatarUrl ? (
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.username}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-bold text-white uppercase">{profile.username[0]}</span>
                                )}
                            </div>
                            {profile.role === 'teacher' && (
                                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-sm" title="Teacher">
                                    <Shield className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {profile.fullName || profile.username}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mb-4 flex items-center justify-center md:justify-start gap-2">
                                <span className={`text-sm font-medium px-2 py-0.5 rounded-full capitalize ${profile.role === 'teacher'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    }`}>
                                    {profile.role}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-sm">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Joined {new Date(profile.createdAt).getFullYear()}
                                </span>
                            </p>

                            {profile.bio && (
                                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto md:mx-0">
                                    {profile.bio}
                                </p>
                            )}

                            <div className="flex items-center justify-center md:justify-start gap-3">
                                {currentUser?.id !== profile.id && (
                                    <button
                                        onClick={handleMessage}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Message
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Uploads ({uploads.length})
                    </h2>
                </div>

                {uploads.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No uploads yet</h3>
                        <p className="text-gray-500">This user hasn't shared any notes or assignments.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uploads.map(upload => (
                            <div
                                key={upload.id}
                                onClick={() => setSelectedUpload(upload)}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`p-2 rounded-lg ${upload.type === 'notes' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                        }`}>
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                        {format(new Date(upload.created_at), 'MMM d, yyyy')}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {upload.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
                                    {upload.subject}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-3">
                                    <span className="flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        {upload.download_count} Downloads
                                    </span>
                                    <span className="flex items-center gap-1">
                                        ⭐ {Number(upload.average_rating || 0).toFixed(1)}
                                    </span>
                                </div>
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
                    currUserId={currentUser?.id}
                />
            )}
        </div>
    );
}
