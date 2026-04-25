import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Sparkles, Download, Star, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const fetchRecommendations = async () => {
    const res = await axios.get('/api/recommendations');
    return res.data.data;
};

export default function RecommendationSection() {
    const { data: recommendations, isLoading, isError } = useQuery({
        queryKey: ['recommendations'],
        queryFn: fetchRecommendations,
        staleTime: 15 * 60 * 1000, // 15 mins
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                ))}
            </div>
        );
    }

    if (isError || !recommendations?.length) return null;

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recommended for You</h2>
                </div>
                <Link to="/browse" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    Browse all <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommendations.map((item) => (
                    <Link
                        key={item.id}
                        to={`/browse?id=${item.id}`} // Assuming browse page can handle detail via query or route
                        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                                {item.subject}
                            </span>
                            <div className="flex items-center gap-1 text-amber-500">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-bold">{item.averageRating || '0.0'}</span>
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {item.title}
                        </h3>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 capitalize">
                                    {item.uploaderName?.[0]}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{item.uploaderName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Download className="w-3 h-3" />
                                <span>{item.downloadCount}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
