import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';

const HIGHLIGHTS = [
    { icon: Lock,        text: 'We never sell your personal data to third parties.' },
    { icon: Eye,         text: 'You have full control over your profile visibility.' },
    { icon: FileText,    text: 'We only collect data necessary for platform features.' },
    { icon: ChevronRight,text: 'You can request data deletion at any time.' },
];

const SECTIONS = [
    {
        title: '1. Information We Collect',
        body: 'When you register for STUDYHUB, we collect basic information such as your name, email address, and username. We also store the content you upload (notes, assignments) and your interactions within the platform (messages, study room participation) to provide and improve our services.',
        list: null,
    },
    {
        title: '2. How We Use Your Data',
        body: 'Your data is used to:',
        list: [
            'Personalize your dashboard and recommendations.',
            'Enable communication between students in rooms and chats.',
            'Track your progress for the gamification system (Leaderboards & Badges).',
            'Ensure the security and integrity of our community.',
        ],
    },
    {
        title: '3. AI Processing',
        body: 'STUDYHUB uses Google Gemini AI for smart document summarization. When you use the "Summarize" feature, the text from your uploaded PDF is processed by our AI services. This data is processed in real-time and is not used to train global AI models without your explicit consent.',
        list: null,
    },
    {
        title: '4. Data Security',
        body: 'We implement industry-standard encryption and security measures to protect your information. However, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and keep your credentials confidential.',
        list: null,
    },
    {
        title: '5. Your Rights',
        body: 'You have the right to access, correct, or delete your personal information. You can also export your data from the platform settings. If you have questions about your privacy, please contact us at viphacker.100.org@gmail.com.',
        list: null,
    },
];

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="bg-foreground pt-32 pb-14 relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-accent" />
                            </div>
                            <p className="text-[10px] font-mono font-black text-accent uppercase tracking-[0.25em]">
                                Legal
                            </p>
                        </div>
                        <h1 className="text-5xl font-display text-white tracking-tight mb-3">Privacy Policy</h1>
                        <p className="text-muted-foreground text-sm font-mono">Last Updated: April 26, 2026</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Highlights card */}
                <Card className="p-8 mb-14 border-accent/20 bg-accent/5">
                    <div className="flex items-center gap-2 mb-6">
                        <Shield className="w-4 h-4 text-accent" />
                        <h2 className="text-base font-display text-foreground">Quick Summary</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                        {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-start gap-3">
                                <Icon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground">{text}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Sections */}
                <div className="space-y-12">
                    {SECTIONS.map(({ title, body, list }, i) => (
                        <motion.section
                            key={title}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h2 className="text-xl font-display text-foreground mb-4">{title}</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">{body}</p>
                            {list && (
                                <ul className="space-y-2 mt-3">
                                    {list.map(item => (
                                        <li key={item} className="flex items-start gap-2.5 text-muted-foreground text-sm">
                                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </motion.section>
                    ))}
                </div>

                {/* Footer note */}
                <div className="mt-20 pt-10 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground">
                        By using STUDYHUB, you agree to the terms outlined in this Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
