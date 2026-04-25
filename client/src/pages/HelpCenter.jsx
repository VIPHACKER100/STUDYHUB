import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Book, Shield, User, MessageSquare } from 'lucide-react';

const FAQ_DATA = [
    {
        category: 'General',
        icon: HelpCircle,
        questions: [
            {
                q: "What is STUDYHUB?",
                a: "STUDYHUB is an all-in-one collaborative learning platform designed for students to share notes, join study rooms, and use AI to summarize educational content."
            },
            {
                q: "Is STUDYHUB free to use?",
                a: "Yes! The core features of STUDYHUB, including file sharing and anonymous rooms, are free for all students."
            }
        ]
    },
    {
        category: 'AI & Intelligence',
        icon: Book,
        questions: [
            {
                q: "How does the PDF summarization work?",
                a: "Our platform uses Google Gemini AI to analyze your uploaded PDFs. It extracts the most important points and creates a concise 3-sentence overview to save you time."
            },
            {
                q: "Is there a limit to how many files I can summarize?",
                a: "Currently, we allow up to 10 AI summaries per day for free accounts to ensure fair usage of our AI resources."
            }
        ]
    },
    {
        category: 'Account & Security',
        icon: Shield,
        questions: [
            {
                q: "Can I use STUDYHUB anonymously?",
                a: "While you need an account to upload, our 'Anonymous Rooms' feature allows you to study and chat using a random identity, protecting your privacy."
            },
            {
                q: "How do I delete my account?",
                a: "You can request account deletion through your Profile Settings or by contacting our support team."
            }
        ]
    }
];

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            {/* Hero Section */}
            <div className="bg-indigo-600 pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">How can we help?</h1>
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search for answers..." 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 border-none shadow-xl focus:ring-4 focus:ring-indigo-300 transition-all text-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-4 gap-12">
                    {/* Sidebar Categories */}
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-bold mb-6">Categories</h2>
                        <nav className="space-y-2">
                            {FAQ_DATA.map((cat, i) => (
                                <button 
                                    key={i}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left font-medium"
                                >
                                    <cat.icon className="w-5 h-5 text-indigo-600" />
                                    {cat.category}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* FAQ Content */}
                    <div className="lg:col-span-3">
                        {FAQ_DATA.map((category, catIdx) => (
                            <div key={catIdx} className="mb-12">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <category.icon className="w-6 h-6 text-indigo-600" />
                                    {category.category}
                                </h2>
                                <div className="space-y-4">
                                    {category.questions.map((item, qIdx) => {
                                        const globalIdx = `${catIdx}-${qIdx}`;
                                        const isOpen = openIndex === globalIdx;
                                        return (
                                            <div 
                                                key={qIdx} 
                                                className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
                                            >
                                                <button 
                                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                                    onClick={() => toggleAccordion(globalIdx)}
                                                >
                                                    <span className="font-bold text-lg">{item.q}</span>
                                                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                </button>
                                                {isOpen && (
                                                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-700 pt-4">
                                                        {item.a}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Still need help? */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 text-center mt-12">
                            <h3 className="text-xl font-bold mb-4">Still have questions?</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Our support team is ready to assist you with any inquiries.</p>
                            <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
