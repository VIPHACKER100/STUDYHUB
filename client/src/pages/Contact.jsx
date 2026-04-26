import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// ─── Constants ────────────────────────────────────────────────────────────────

const INPUT_BASE =
    'w-full px-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground ' +
    'placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 ' +
    'focus:ring-accent/40 focus:border-accent transition-all resize-none';

const CONTACT_INFO = [
    { icon: Mail, label: 'Email', value: 'viphacker.100.org@gmail.com' },
    { icon: Phone, label: 'Support', value: '+91 7389718429' },
    { icon: MapPin, label: 'Headquarters', value: 'Madhya Pradesh, India' },
];

const HELP_CARDS = [
    { icon: HelpCircle, label: 'Help Center', desc: 'Find quick answers in our FAQ.', href: '/help' },
    { icon: ShieldCheck, label: 'Report Abuse', desc: 'Help us keep STUDYHUB safe.', href: '#' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '', email: '', subject: 'general', message: ''
    });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        await new Promise(r => setTimeout(r, 800));
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ name: '', email: '', subject: 'general', message: '' });
        setSending(false);
    };

    const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

    return (
        <div className="min-h-screen bg-background">

            {/* ── Hero ─────────────────────────────────────────────── */}
            <div className="bg-foreground pt-32 pb-16 relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="text-[10px] font-mono font-black text-accent uppercase tracking-[0.25em] mb-4">
                            Support
                        </p>
                        <h1 className="text-5xl font-display text-white tracking-tight mb-4">Contact Us</h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Have questions, feedback, or need support? Our team is here to help.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* ── Main Content ─────────────────────────────────────── */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-10">

                        {/* Info Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-8"
                        >
                            {/* Contact details */}
                            <div>
                                <h2 className="text-xl font-display text-foreground mb-6">Reach us directly</h2>
                                <div className="space-y-5">
                                    {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-4 h-4 text-accent" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground text-sm">{label}</p>
                                                <p className="text-muted-foreground text-sm">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Help shortcuts */}
                            <div className="space-y-3">
                                {HELP_CARDS.map(({ icon: Icon, label, desc, href }) => (
                                    <Link key={label} to={href}>
                                        <Card className="p-4 hover:border-accent/30 transition-colors group cursor-pointer">
                                            <div className="flex items-start gap-3">
                                                <Icon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-bold text-foreground text-sm group-hover:text-accent transition-colors">
                                                        {label}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{desc}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>

                        {/* Form Column */}
                        <motion.div
                            className="lg:col-span-2"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Card className="p-8 md:p-10">
                                <h3 className="text-xl font-display text-foreground mb-8">Send us a message</h3>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name + Email row */}
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-foreground mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text" required
                                                className={INPUT_BASE}
                                                placeholder="Aryan Ahirwar"
                                                value={formData.name}
                                                onChange={set('name')}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-foreground mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email" required
                                                className={INPUT_BASE}
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={set('email')}
                                            />
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-bold text-foreground mb-2">Subject</label>
                                        <select className={INPUT_BASE} value={formData.subject} onChange={set('subject')}>
                                            <option value="general">General Inquiry</option>
                                            <option value="support">Technical Support</option>
                                            <option value="feedback">Product Feedback</option>
                                            <option value="partnership">Partnership</option>
                                        </select>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-bold text-foreground mb-2">Message</label>
                                        <textarea
                                            required rows={5}
                                            className={INPUT_BASE}
                                            placeholder="How can we help you?"
                                            value={formData.message}
                                            onChange={set('message')}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full py-4 rounded-xl"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            {sending ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending…
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Send Message
                                                    <ArrowRight className="w-4 h-4 ml-auto" />
                                                </>
                                            )}
                                        </span>
                                    </Button>
                                </form>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
