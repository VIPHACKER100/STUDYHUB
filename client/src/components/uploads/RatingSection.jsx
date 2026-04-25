import React, { useState } from 'react';
import { Star, Send, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { uploadAPI } from '../../services/api';

export default function RatingSection({ uploadId, ratings, onRatingSubmit }) {
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newRating === 0) return toast.error("Please select a star rating");

        setSubmitting(true);
        try {
            await uploadAPI.rate(uploadId, {
                rating: newRating,
                comment: newComment
            });
            toast.success("Review submitted!");
            setNewRating(0);
            setNewComment('');
            if (onRatingSubmit) onRatingSubmit();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {ratings.length > 0
                                ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
                                : 'New'}
                        </span>
                    </div>
                    <span className="text-sm text-gray-500">
                        ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
                    </span>
                </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {ratings.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="w-8 h-8 text-yellow-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reviews yet</h3>
                        <p className="text-gray-500 text-sm">Be the first to rate this upload!</p>
                    </div>
                ) : (
                    ratings.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-200 font-semibold text-sm">
                                        {review.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                                            {review.full_name || review.username}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {format(new Date(review.created_at), 'MMM d, yyyy')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                    ))}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed ml-13 pl-13">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Review Form */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Rating:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-6 h-6 ${star <= newRating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a review... (optional)"
                            className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm min-h-[80px]"
                        />
                        <button
                            type="submit"
                            disabled={submitting || newRating === 0}
                            className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}



