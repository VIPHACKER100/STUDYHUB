import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Shield, Heart, GraduationCap, ArrowRight } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            {/* Header / Breadcrumb */}
            <div className="bg-gray-50 dark:bg-gray-800/50 pt-32 pb-12 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-black mb-4">About STUDYHUB</h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Empowering students worldwide through collaborative intelligence and seamless resource sharing.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-6">
                                <Target className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                We believe that education should be a collaborative journey, not a solitary struggle. STUDYHUB was built to break down silos between students, allowing them to share knowledge, study together in focused environments, and leverage AI to accelerate their learning.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                Our goal is to create the world's most accessible and intelligent study ecosystem where every student has the tools they need to succeed, regardless of their background or location.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-video rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl flex items-center justify-center p-8 overflow-hidden">
                                <GraduationCap className="w-32 h-32 text-white/20 absolute -right-4 -bottom-4 rotate-12" />
                                <div className="relative z-10 text-center">
                                    <div className="text-5xl font-black text-white mb-2">10M+</div>
                                    <div className="text-indigo-100 font-bold uppercase tracking-widest text-sm">Target Students</div>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-gray-50 dark:bg-gray-850">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                    <p className="text-gray-600 dark:text-gray-400">The principles that guide everything we build at STUDYHUB.</p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center mb-6">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Community First</h3>
                        <p className="text-gray-600 dark:text-gray-400">Everything we do starts with the student. We build features that solve real academic problems.</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Integrity & Trust</h3>
                        <p className="text-gray-600 dark:text-gray-400">We prioritize privacy and data security, ensuring a safe space for students to collaborate.</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Radical Inclusion</h3>
                        <p className="text-gray-600 dark:text-gray-400">We design for everyone. Our platform is built to be accessible to students from all walks of life.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">Become part of the story.</h2>
                    <p className="text-indigo-100 text-lg mb-10">Join thousands of students who are already changing the way they learn.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                            Join STUDYHUB
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/contact" className="px-8 py-4 bg-indigo-700/50 text-white border border-indigo-400/30 rounded-full font-bold hover:bg-indigo-700 transition-all">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
