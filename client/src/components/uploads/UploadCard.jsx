import React from 'react';
import { Download, Star, BookmarkIcon, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function UploadCard({ upload, onClick }) {
    const getFileIcon = (fileType) => {
        if (fileType?.includes('pdf')) return '📄';
        if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
        if (fileType?.includes('presentation')) return '📊';
        if (fileType?.includes('sheet') || fileType?.includes('excel')) return '📈';
        if (fileType?.includes('image')) return '🖼️';
        if (fileType?.includes('zip') || fileType?.includes('rar')) return '📦';
        return '📎';
    };

    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 cursor-pointer group"
        >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
                <div className="text-4xl">{getFileIcon(upload.file_type)}</div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 truncate">
                        {upload.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded capitalize">
                            {upload.type}
                        </span>
                        <span>•</span>
                        <span>{upload.subject}</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            {upload.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {upload.description}
                </p>
            )}

            {/* Tags */}
            {upload.tags && upload.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {upload.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                            #{tag}
                        </span>
                    ))}
                    {upload.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{upload.tags.length - 3}</span>
                    )}
                </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Download className="w-4 h-4" />
                    <span>{upload.download_count || 0}</span>
                </div>
                {upload.average_rating && (
                    <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{parseFloat(upload.average_rating).toFixed(1)}</span>
                        <span className="text-gray-500">({upload.rating_count})</span>
                    </div>
                )}
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(upload.created_at), 'MMM d, yyyy')}</span>
                </div>
            </div>

            {/* Uploader */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        {upload.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-gray-900 dark:text-white">{upload.full_name || upload.username}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs capitalize">{upload.role}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Bookmark"
                    >
                        <BookmarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center gap-1"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
}
