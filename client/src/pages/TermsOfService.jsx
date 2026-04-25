import React from 'react';
import { Scale, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl font-black mb-4 flex items-center gap-4 justify-center md:justify-start">
                        <Scale className="w-10 h-10 text-indigo-600" />
                        Terms of Service
                    </h1>
                    <p className="text-gray-500 font-medium">Last Updated: April 26, 2026</p>
                </div>

                <div className="prose prose-indigo dark:prose-invert max-w-none space-y-12">
                    <section className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                        <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                            <strong>Academic Integrity Warning:</strong> STUDYHUB is designed for collaborative learning and resource sharing. We strictly prohibit the use of our platform for cheating, plagiarism, or any form of academic dishonesty.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            By accessing or using the STUDYHUB platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            To use certain features, you must register for an account. You are responsible for:
                        </p>
                        <ul className="list-none space-y-3">
                            <li className="flex gap-3 text-gray-600 dark:text-gray-400">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                Maintaining the confidentiality of your account credentials.
                            </li>
                            <li className="flex gap-3 text-gray-600 dark:text-gray-400">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                All activities that occur under your account.
                            </li>
                            <li className="flex gap-3 text-gray-600 dark:text-gray-400">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                Providing accurate and current information during registration.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Content Guidelines</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            You retain ownership of the content you upload, but you grant STUDYHUB a license to host and display it. You agree not to upload:
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-sm">
                                • Copyrighted materials without permission.
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-sm">
                                • Harassing, hateful, or offensive content.
                            </li>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-sm">
                                • Malware or harmful code.
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-sm">
                                • Private exams or sensitive academic tests.
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Platform Use & AI</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            You may use the platform only for educational purposes. Any automated use (bots, scrapers) is prohibited. AI-generated summaries provided by the platform are tools for study and should not be considered definitive academic sources.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Termination</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We reserve the right to suspend or terminate your account at our discretion if you violate these terms or engage in conduct that we believe is harmful to other users or the platform's integrity.
                        </p>
                    </section>
                </div>

                <div className="mt-20 pt-12 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4 text-gray-500">
                    <Info className="w-5 h-5" />
                    <p className="text-sm">
                        Questions about these terms? Reach out to viphacker.100.org@gmail.com.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
