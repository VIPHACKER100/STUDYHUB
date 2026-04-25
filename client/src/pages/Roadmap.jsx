import React from 'react';
import { Rocket, CheckCircle2, Clock, Calendar, Zap, Sparkles, Code, Globe } from 'lucide-react';

const ROADMAP_DATA = [
    {
        title: 'Phase 5: Intelligence Layer',
        status: 'completed',
        date: 'April 2026',
        items: [
            'Gemini AI PDF Summarization',
            'Smart Dashboard Recommendations',
            'Gamification (Leaderboards & Badges)',
            'Real-time Notification System'
        ]
    },
    {
        title: 'Phase 6: Advanced Collaboration',
        status: 'current',
        date: 'May - June 2026',
        items: [
            'Shared Virtual Whiteboards in Rooms',
            'Video Group Study (WebRTC Integration)',
            'Live Collaborative Document Editing',
            'Subject-Specific AI Mentors'
        ]
    },
    {
        title: 'Phase 7: Mobile & Global',
        status: 'upcoming',
        date: 'Q3 2026',
        items: [
            'Native iOS & Android Applications',
            'Multi-language Support (i18n)',
            'Offline Mode for Mobile App',
            'Institutional Dashboard for Universities'
        ]
    }
];

const Roadmap = () => {
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <div className="bg-gray-50 dark:bg-gray-800/50 pt-32 pb-16 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-6">
                        <Rocket className="w-3.5 h-3.5" />
                        <span>The Future of STUDYHUB</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Our Product Roadmap</h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        We are building the most advanced educational platform in the world. Here is where we've been and where we are heading.
                    </p>
                </div>
            </div>

            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="relative border-l-2 border-gray-100 dark:border-gray-800 ml-4 md:ml-0 md:left-1/2 md:-translate-x-1/2">
                        {ROADMAP_DATA.map((phase, idx) => (
                            <div key={idx} className={`relative mb-16 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right md:ml-0' : 'md:pl-12 md:ml-[50%]'}`}>
                                {/* Dot */}
                                <div className={`absolute top-0 w-8 h-8 rounded-full border-4 border-white dark:border-gray-900 shadow-lg flex items-center justify-center z-10 
                                    ${idx % 2 === 0 
                                        ? 'left-[-17px] md:left-auto md:right-[-17px]' 
                                        : 'left-[-17px]'
                                    } 
                                    ${phase.status === 'completed' ? 'bg-green-500' : phase.status === 'current' ? 'bg-indigo-600 animate-pulse' : 'bg-gray-400'}`}
                                >
                                    {phase.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-white" />}
                                    {phase.status === 'current' && <Zap className="w-4 h-4 text-white" />}
                                    {phase.status === 'upcoming' && <Clock className="w-4 h-4 text-white" />}
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <div className="text-sm font-bold text-indigo-600 mb-2">{phase.date}</div>
                                    <h3 className="text-2xl font-black mb-4">{phase.title}</h3>
                                    <ul className={`space-y-3 ${idx % 2 === 0 ? 'md:flex md:flex-col md:items-end' : ''}`}>
                                        {phase.items.map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                                {idx % 2 === 0 && <span className="hidden md:block">{item}</span>}
                                                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${phase.status === 'completed' ? 'text-green-500' : 'text-gray-300'}`} />
                                                {(idx % 2 !== 0 || window.innerWidth < 768) && <span>{item}</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-20">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-10 rounded-[3rem] border border-indigo-100 dark:border-indigo-800">
                            <h2 className="text-2xl font-bold mb-4">Have a feature request?</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">We build STUDYHUB based on your feedback. Tell us what you want to see next!</p>
                            <Link to="/contact" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
                                Suggest a Feature
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Roadmap;
