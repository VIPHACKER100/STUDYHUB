import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'general',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send an email via the backend
        console.log('Contact form submitted:', formData);
        toast.success('Message sent! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: 'general', message: '' });
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <div className="bg-gray-50 dark:bg-gray-800/50 pt-32 pb-12 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-black mb-4">Contact Us</h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Have questions, feedback, or need support? Our team is here to help you.
                    </p>
                </div>
            </div>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Info Column */}
                        <div className="lg:col-span-1 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Email</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">viphacker.100.org@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Support</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">+1 (555) STUDY-HUB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Headquarters</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">Tech City, Innovation District<br />Global Education Hub</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Help Cards */}
                            <div className="grid gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <HelpCircle className="w-6 h-6 text-indigo-600 mb-2" />
                                    <p className="font-bold text-sm">Help Center</p>
                                    <p className="text-xs text-gray-500">Find quick answers in our FAQ.</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <ShieldCheck className="w-6 h-6 text-blue-600 mb-2" />
                                    <p className="font-bold text-sm">Report Abuse</p>
                                    <p className="text-xs text-gray-500">Help us keep STUDYHUB safe.</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
                                <h3 className="text-2xl font-bold mb-8">Send us a Message</h3>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Full Name</label>
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Email Address</label>
                                            <input 
                                                type="email" 
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Subject</label>
                                        <select 
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        >
                                            <option value="general">General Inquiry</option>
                                            <option value="support">Technical Support</option>
                                            <option value="feedback">Product Feedback</option>
                                            <option value="partnership">Partnership</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Message</label>
                                        <textarea 
                                            required
                                            rows="5"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            placeholder="How can we help you?"
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit"
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 active:scale-[0.98]"
                                    >
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
