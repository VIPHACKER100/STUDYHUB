import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Zap, Users, Trophy, BookOpen, Search, Share2, 
    MessageSquare, Shield, Globe, ArrowRight, Sparkles 
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className={`p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all group`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${color}`}>
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
);

const Features = () => {
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            {/* Hero */}
            <section className="pt-32 pb-16 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Designed for Modern <br/> Collaborative Learning</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        We've built a suite of powerful tools to help you manage your study materials, collaborate with peers, and leverage AI for better grades.
                    </p>
                </div>
            </section>

            {/* Pillar 1: AI Intelligence */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold mb-6">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Phase 5 Intelligence</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">AI-Powered Note Intelligence</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                Don't just store your notes—understand them. Our AI-powered system analyzes your uploaded PDFs to help you grasp complex concepts faster.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <Zap className="w-5 h-5 text-blue-500" />
                                    <span>Instant 3-sentence overviews of long documents</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <Zap className="w-5 h-5 text-blue-500" />
                                    <span>Key Takeaway extraction for quick review</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <Zap className="w-5 h-5 text-blue-500" />
                                    <span>Smart Recommendations based on your study habits</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[3rem] p-1 shadow-2xl">
                            <div className="bg-white dark:bg-gray-900 rounded-[2.8rem] p-8 h-full">
                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4"></div>
                                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-full"></div>
                                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-5/6"></div>
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="text-sm font-bold text-blue-600 mb-2">AI SUMMARY</div>
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl italic text-gray-600 dark:text-gray-400 text-sm">
                                            "This document covers the core principles of React State management, focusing on Hooks and the Context API for efficient data flow..."
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pillar 2: Anonymous Collaboration */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                        <div className="order-2 lg:order-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-1 shadow-2xl">
                            <div className="bg-white dark:bg-gray-900 rounded-[2.8rem] p-8 h-full flex flex-col justify-center gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500"></div>
                                    <div className="text-sm font-bold">Anonymous Owl: "Does anyone understand the third law?"</div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 self-end">
                                    <div className="text-sm font-bold">You (Brave Lion): "I can help! Here is a simple explanation..."</div>
                                    <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Anonymous Collaboration</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                Join our subject-specific study rooms where focus is the only priority. No social pressure, just learning.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <Shield className="w-5 h-5 text-indigo-500" />
                                    <span>Randomized identities for safe questioning</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <MessageSquare className="w-5 h-5 text-indigo-500" />
                                    <span>Real-time chat with fellow students</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <Users className="w-5 h-5 text-indigo-500" />
                                    <span>Moderated environment for focused study</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Pillar 3: Gamification */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Gamified Recognition</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                Your contributions matter. Earn recognition for helping the community and climbing the global rankings.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                                    <Trophy className="w-6 h-6 text-amber-600 mb-2" />
                                    <div className="font-bold">Leaderboards</div>
                                    <div className="text-xs text-gray-500">Top contributors ranked monthly</div>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                                    <Sparkles className="w-6 h-6 text-purple-600 mb-2" />
                                    <div className="font-bold">12+ Badges</div>
                                    <div className="text-xs text-gray-500">Earn rewards for specific milestones</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[3rem] p-8 shadow-2xl text-white text-center">
                            <Trophy className="w-20 h-20 mx-auto mb-6 drop-shadow-lg" />
                            <h3 className="text-2xl font-black mb-2">Rising Star Badge</h3>
                            <p className="text-amber-50 text-sm">Earned for sharing 5 high-quality notes</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-indigo-600 text-white text-center px-4">
                <h2 className="text-3xl md:text-5xl font-black mb-8">Ready to experience these features?</h2>
                <Link to="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-600 rounded-full font-black text-xl hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-black/20">
                    Join STUDYHUB Now
                    <ArrowRight className="w-6 h-6" />
                </Link>
            </section>
        </div>
    );
};

export default Features;
