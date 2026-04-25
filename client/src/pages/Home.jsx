import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
    BookOpen, 
    MessageSquare, 
    Shield, 
    Trophy, 
    Zap, 
    Globe, 
    ArrowRight,
    Users,
    Sparkles
} from 'lucide-react';
import useAuthStore from '../stores/authStore';

const Home = () => {
    const { isAuthenticated } = useAuthStore();

    // If already logged in, show dashboard instead
    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
            {/* Navigation Header */}
            <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-1.5 rounded-lg">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">STUDYHUB</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
                            <a href="#about" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</a>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400">Log in</Link>
                            <Link 
                                to="/register" 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105 active:scale-95"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-8 animate-fade-in border border-indigo-100 dark:border-indigo-800">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Intelligence Layer Phase 5 is Live!</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                        The Smartest Way to <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            Collaborate & Learn
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        STUDYHUB is a comprehensive educational platform that combines file sharing, real-time messaging, anonymous study rooms, and AI-powered intelligence.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            to="/register" 
                            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/40 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
                        >
                            Start Learning for Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link 
                            to="/login" 
                            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-all shadow-sm"
                        >
                            Platform Login
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-gray-100 dark:border-gray-800 pt-12">
                        <div>
                            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">50k+</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Notes Shared</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">10k+</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Active Students</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">99%</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Satisfaction</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">24/7</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">AI Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50 dark:bg-gray-850">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Learners</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to succeed academically, all in one seamless dashboard.</p>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">AI Smart Summary</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Upload your PDFs and let our Gemini AI extract key takeaways and generate 3-sentence overviews instantly.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Anonymous Rooms</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Join subject-specific study rooms with random identities. Focus on the learning, not the social pressure.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Trophy className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Gamified Growth</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Earn points for sharing, collect 12+ unique badges, and climb the global contributor leaderboard.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 overflow-hidden relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-500/50">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Ready to level up <br className="hidden md:block" /> your study game?</h2>
                            <p className="text-indigo-100 text-xl mb-10 max-w-xl mx-auto">Join the STUDYHUB community today and experience a new era of collaborative learning.</p>
                            <Link 
                                to="/register" 
                                className="inline-flex items-center justify-center px-10 py-5 bg-white text-indigo-600 rounded-full font-black text-xl hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-black/20"
                            >
                                Get Started for Free
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="bg-gray-200 dark:bg-gray-800 p-1 rounded">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">STUDYHUB</span>
                        </div>
                        <p>© 2026 STUDYHUB Platform. Built for the future of education.</p>
                        <div className="flex items-center space-x-6">
                            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">Contact Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
