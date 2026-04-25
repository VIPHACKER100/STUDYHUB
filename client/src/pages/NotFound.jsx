import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Ghost } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-20">
            <div className="max-w-md w-full text-center">
                {/* 404 Visual */}
                <div className="relative mb-12">
                    <div className="text-[12rem] font-black text-gray-200 dark:text-gray-800 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-indigo-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-indigo-500/50">
                            <Ghost className="w-12 h-12 text-white" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-black mb-4">Oops! Page Lost in Space</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed text-lg">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="flex flex-col gap-4">
                    <Link 
                        to="/" 
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <Link 
                        to="/dashboard" 
                        className="w-full py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all"
                    >
                        <Search className="w-5 h-5" />
                        Go to Dashboard
                    </Link>
                </div>

                <button 
                    onClick={() => window.history.back()}
                    className="mt-8 text-gray-500 hover:text-indigo-600 font-bold flex items-center gap-2 mx-auto transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFound;
