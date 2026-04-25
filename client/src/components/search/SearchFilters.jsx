import React, { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';

export default function SearchFilters({ onFilter, initialFilters = {} }) {
    const [filters, setFilters] = useState({
        q: initialFilters.q || '',
        subject: initialFilters.subject || '',
        type: initialFilters.type || '',
        sortBy: initialFilters.sortBy || 'newest',
        tags: initialFilters.tags || '',
        uploader: initialFilters.uploader || '',
        dateFrom: initialFilters.dateFrom || '',
        dateTo: initialFilters.dateTo || ''
    });

    const [isOpen, setIsOpen] = useState(false); // Mobile toggle

    const handleChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    const clearFilters = () => {
        const cleared = {
            q: '',
            subject: '',
            type: '',
            sortBy: 'newest',
            tags: '',
            uploader: '',
            dateFrom: '',
            dateTo: ''
        };
        setFilters(cleared);
        onFilter(cleared);
    };

    const hasActiveFilters = filters.q || filters.subject || filters.type || filters.sortBy !== 'newest' || filters.tags || filters.uploader || filters.dateFrom;

    return (
        <div className="mb-6 space-y-4">
            {/* Main Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search items, descriptions..."
                    value={filters.q}
                    onChange={(e) => handleChange('q', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden"
                >
                    <Filter className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Advanced Filters Panel */}
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${isOpen ? 'block' : 'hidden md:grid'}`}>
                {/* Subject Filter */}
                <input
                    type="text"
                    placeholder="Filter by Subject"
                    value={filters.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Type Filter */}
                <select
                    value={filters.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                    <option value="">All Types</option>
                    <option value="notes">Notes</option>
                    <option value="assignment">Assignments</option>
                    <option value="pdf">PDFs</option>
                    <option value="image">Images</option>
                </select>

                {/* Sort Filter */}
                <select
                    value={filters.sortBy}
                    onChange={(e) => handleChange('sortBy', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="rated">Highest Rated</option>
                </select>

                {/* Uploader Filter */}
                <input
                    type="text"
                    placeholder="Filter by Uploader"
                    value={filters.uploader}
                    onChange={(e) => handleChange('uploader', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Tags Filter */}
                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={filters.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Date From */}
                <input
                    type="date"
                    placeholder="From Date"
                    value={filters.dateFrom}
                    onChange={(e) => handleChange('dateFrom', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Date To */}
                <input
                    type="date"
                    placeholder="To Date"
                    value={filters.dateTo}
                    onChange={(e) => handleChange('dateTo', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Clear Button */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-red-200"
                    >
                        <X className="w-4 h-4" />
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}
