import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Search, Book, Shield, MessageSquare, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const FAQ_DATA = [
    {
        category: 'General',
        icon: HelpCircle,
        questions: [
            {
                q: "What is STUDYHUB?",
                a: "STUDYHUB is a precision-engineered collaborative learning platform. It's designed to streamline the academic workflow through intelligent file sharing, real-time messaging, and AI-powered insights."
            },
            {
                q: "Is STUDYHUB free to use?",
                a: "Our core intelligence layer and collaboration tools are free for all students. We believe in democratizing access to high-quality learning tools."
            }
        ]
    },
    {
        category: 'AI & Intelligence',
        icon: Book,
        questions: [
            {
                q: "How does the PDF summarization work?",
                a: "Our system leverages the Gemini Pro architecture to process educational material. It distill complex documents into essential takeaways, allowing you to master content in a fraction of the time."
            },
            {
                q: "Is there a limit to summaries?",
                a: "Free accounts include 10 high-precision summaries daily. This allows for focused study sessions while maintaining the performance of our neural processing layer."
            }
        ]
    },
    {
        category: 'Account & Security',
        icon: Shield,
        questions: [
            {
                q: "Can I use STUDYHUB anonymously?",
                a: "Privacy is a first-class citizen here. Our 'Anonymous Rooms' utilize random cryptonyms, ensuring your identity remains protected during collaborative sessions."
            },
            {
                q: "How do I delete my account?",
                a: "You retain full ownership of your data. Account termination can be initiated directly from your security dashboard at any time."
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

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    const stagger = {
        visible: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-40 pb-32 overflow-hidden bg-foreground">
                <div className="absolute inset-0 bg-dot-pattern opacity-10" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
                
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <Badge variant="outline" className="mb-8 border-accent/30 bg-accent/5 text-accent-secondary">
                            SUPPORT CENTER
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-display text-white mb-8">
                            How can we <span className="gradient-text">help?</span>
                        </h1>
                        <div className="relative max-w-2xl mx-auto group">
                            <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search for answers..." 
                                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white text-foreground border-none shadow-2xl focus:ring-2 focus:ring-accent transition-all text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-24">
                <div className="grid lg:grid-cols-4 gap-16">
                    {/* Sidebar Categories */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-32">
                            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground mb-8">Categories</h2>
                            <nav className="space-y-2">
                                {FAQ_DATA.map((cat, i) => (
                                    <button 
                                        key={i}
                                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-all group text-left"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-accent/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                            <cat.icon className="w-5 h-5 text-accent" />
                                        </div>
                                        <span className="font-medium text-foreground group-hover:text-accent transition-colors">{cat.category}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* FAQ Content */}
                    <main className="lg:col-span-3">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                        >
                            {FAQ_DATA.map((category, catIdx) => (
                                <div key={catIdx} className="mb-20">
                                    <h2 className="text-3xl font-display text-foreground mb-10 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center shadow-accent">
                                            <category.icon className="w-6 h-6 text-white" />
                                        </div>
                                        {category.category}
                                    </h2>
                                    <div className="space-y-4">
                                        {category.questions.map((item, qIdx) => {
                                            const globalIdx = `${catIdx}-${qIdx}`;
                                            const isOpen = openIndex === globalIdx;
                                            return (
                                                <motion.div key={qIdx} variants={fadeInUp}>
                                                    <div className={`border border-border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg border-accent/20' : 'hover:border-accent/30'}`}>
                                                        <button 
                                                            className="w-full px-8 py-6 flex items-center justify-between text-left transition-colors"
                                                            onClick={() => toggleAccordion(globalIdx)}
                                                        >
                                                            <span className="font-semibold text-lg text-foreground">{item.q}</span>
                                                            <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-accent/10 text-accent' : ''}`}>
                                                                <ChevronDown className="w-5 h-5" />
                                                            </div>
                                                        </button>
                                                        <AnimatePresence>
                                                            {isOpen && (
                                                                <motion.div 
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                                >
                                                                    <div className="px-8 pb-8 text-muted-foreground leading-relaxed">
                                                                        <div className="pt-4 border-t border-border">
                                                                            {item.a}
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Still need help? */}
                        <Card variant="elevated" className="p-12 text-center mt-20 bg-foreground relative overflow-hidden">
                            <div className="absolute inset-0 bg-dot-pattern opacity-5" />
                            <div className="relative z-10">
                                <Badge className="mb-6 bg-accent/20 text-accent-secondary border-none">GET IN TOUCH</Badge>
                                <h3 className="text-3xl font-display text-white mb-6">Still have questions?</h3>
                                <p className="text-muted-foreground mb-10 max-w-md mx-auto">Our intelligence support team is ready to assist you with any inquiries regarding the platform.</p>
                                <Button size="lg" className="rounded-full group">
                                    Contact Support
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;

