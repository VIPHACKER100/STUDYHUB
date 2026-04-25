import React from 'react';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
                    <p className="text-gray-500 font-medium">Last Updated: April 26, 2026</p>
                </div>

                {/* Highlights Card */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] p-8 mb-12 border border-indigo-100 dark:border-indigo-800">
                    <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Quick Summary
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <Lock className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">We never sell your personal data to third parties.</p>
                        </div>
                        <div className="flex gap-4">
                            <Eye className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">You have full control over your profile visibility.</p>
                        </div>
                        <div className="flex gap-4">
                            <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">We only collect data necessary for platform features.</p>
                        </div>
                        <div className="flex gap-4">
                            <ChevronRight className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">You can request data deletion at any time.</p>
                        </div>
                    </div>
                </div>

                <div className="prose prose-indigo dark:prose-invert max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            When you register for STUDYHUB, we collect basic information such as your name, email address, and username. We also store the content you upload (notes, assignments) and your interactions within the platform (messages, study room participation) to provide and improve our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Data</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            Your data is used to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                            <li>Personalize your dashboard and recommendations.</li>
                            <li>Enable communication between students in rooms and chats.</li>
                            <li>Track your progress for the gamification system (Leaderboards & Badges).</li>
                            <li>Ensure the security and integrity of our community.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. AI Processing</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            STUDYHUB uses Google Gemini AI for smart document summarization. When you use the "Summarize" feature, the text from your uploaded PDF is processed by our AI services. This data is processed in real-time and is not used to train global AI models without your explicit consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We implement industry-standard encryption and security measures to protect your information. However, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and keep your credentials confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            You have the right to access, correct, or delete your personal information. You can also export your data from the platform settings. If you have questions about your privacy, please contact us at viphacker.100.org@gmail.com.
                        </p>
                    </section>
                </div>

                <div className="mt-20 pt-12 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-sm text-gray-500">
                        By using STUDYHUB, you agree to the terms outlined in this Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
