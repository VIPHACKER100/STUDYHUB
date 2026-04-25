import React from 'react';
import { motion } from 'framer-motion';
import { Scale, AlertCircle, CheckCircle2, Info, Mail } from 'lucide-react';
import { Card } from '../components/ui/Card';

const SECTIONS = [
    {
        title: '1. Acceptance of Terms',
        body: 'By accessing or using the STUDYHUB platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the platform.',
        list: null,
        grid: null,
    },
    {
        title: '2. User Accounts',
        body: 'To use certain features, you must register for an account. You are responsible for:',
        list: [
            'Maintaining the confidentiality of your account credentials.',
            'All activities that occur under your account.',
            'Providing accurate and current information during registration.',
        ],
        grid: null,
    },
    {
        title: '3. Content Guidelines',
        body: 'You retain ownership of the content you upload, but you grant STUDYHUB a license to host and display it. You agree not to upload:',
        list: null,
        grid: [
            'Copyrighted materials without permission.',
            'Harassing, hateful, or offensive content.',
            'Malware or harmful code.',
            'Private exams or sensitive academic tests.',
        ],
    },
    {
        title: '4. Platform Use & AI',
        body: 'You may use the platform only for educational purposes. Any automated use (bots, scrapers) is prohibited. AI-generated summaries provided by the platform are tools for study and should not be considered definitive academic sources.',
        list: null,
        grid: null,
    },
    {
        title: '5. Termination',
        body: 'We reserve the right to suspend or terminate your account at our discretion if you violate these terms or engage in conduct that we believe is harmful to other users or the platform\'s integrity.',
        list: null,
        grid: null,
    },
];

export default function TermsOfService() {
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
                                <Scale className="w-5 h-5 text-accent" />
                            </div>
                            <p className="text-[10px] font-mono font-black text-accent uppercase tracking-[0.25em]">
                                Legal
                            </p>
                        </div>
                        <h1 className="text-5xl font-display text-white tracking-tight mb-3">Terms of Service</h1>
                        <p className="text-muted-foreground text-sm font-mono">Last Updated: April 26, 2026</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Academic Integrity Warning */}
                <Card className="p-6 mb-14 border-yellow-500/20 bg-yellow-500/5 flex gap-4">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="font-bold text-foreground">Academic Integrity Warning: </span>
                        STUDYHUB is designed for collaborative learning and resource sharing. We strictly prohibit
                        the use of our platform for cheating, plagiarism, or any form of academic dishonesty.
                    </p>
                </Card>

                {/* Sections */}
                <div className="space-y-12">
                    {SECTIONS.map(({ title, body, list, grid }, i) => (
                        <motion.section
                            key={title}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h2 className="text-xl font-display text-foreground mb-4">{title}</h2>
                            <p className="text-muted-foreground leading-relaxed">{body}</p>

                            {list && (
                                <ul className="space-y-3 mt-4">
                                    {list.map(item => (
                                        <li key={item} className="flex items-start gap-3 text-muted-foreground text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {grid && (
                                <div className="grid sm:grid-cols-2 gap-3 mt-5">
                                    {grid.map(item => (
                                        <div
                                            key={item}
                                            className="p-4 bg-muted/50 border border-border rounded-xl text-sm text-muted-foreground"
                                        >
                                            <span className="text-accent font-bold mr-1.5">•</span>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.section>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-20 pt-10 border-t border-border flex items-start gap-3">
                    <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                        Questions about these terms? Reach out to{' '}
                        <a href="mailto:viphacker.100.org@gmail.com" className="text-accent font-bold hover:text-accent/80 transition-colors">
                            viphacker.100.org@gmail.com
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
