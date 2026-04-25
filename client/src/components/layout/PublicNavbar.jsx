import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import useAuthStore from '../../stores/authStore';

const PublicNavbar = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/50 transition-all">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">STUDYHUB</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/features" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-gray-700 dark:text-gray-300">Features</Link>
                        <Link to="/about" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-gray-700 dark:text-gray-300">About</Link>
                        <Link to="/roadmap" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-gray-700 dark:text-gray-300">Roadmap</Link>
                        <Link to="/contact" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-gray-700 dark:text-gray-300">Contact</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-300">Log in</Link>
                                <Link to="/register" className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                                    Sign Up
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
