import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

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
    const fadeInUp = {
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <header className="relative pt-40 pb-24 overflow-hidden bg-foreground">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -mr-64 -mt-64" />
                
                <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <Badge variant="outline" className="mb-6 border-accent/30 bg-accent/5 text-accent-secondary">
                            <Rocket className="w-3.5 h-3.5 mr-2" />
                            THE FUTURE OF STUDYHUB
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-display text-white mb-6">
                            Our Product <span className="gradient-text">Roadmap</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                            Building the most advanced educational intelligence platform. 
                            Transparency is one of our core values—here is our vision for the months ahead.
                        </p>
                    </motion.div>
                </div>
            </header>

            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

                    <div className="space-y-24">
                        {ROADMAP_DATA.map((phase, idx) => (
                            <motion.div 
                                key={idx}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={fadeInUp}
                                className={`relative flex flex-col ${idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                            >
                                {/* Center Dot */}
                                <div className={`absolute left-4 md:left-1/2 top-0 w-8 h-8 -translate-x-1/2 rounded-full border-4 border-background z-20 flex items-center justify-center shadow-lg
                                    ${phase.status === 'completed' ? 'bg-green-500' : phase.status === 'current' ? 'bg-accent shadow-accent' : 'bg-muted'}
                                `}>
                                    {phase.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-white" />}
                                    {phase.status === 'current' && <Zap className="w-4 h-4 text-white animate-pulse" />}
                                    {phase.status === 'upcoming' && <Clock className="w-4 h-4 text-muted-foreground" />}
                                </div>

                                {/* Content Card */}
                                <div className={`ml-12 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pl-16' : 'md:pr-16 md:text-right'}`}>
                                    <div className={`inline-block mb-3 text-sm font-mono tracking-widest ${phase.status === 'current' ? 'text-accent' : 'text-muted-foreground'}`}>
                                        {phase.date}
                                    </div>
                                    <h3 className="text-2xl font-display text-foreground mb-6">{phase.title}</h3>
                                    
                                    <Card variant={phase.status === 'current' ? 'featured' : 'default'} className="p-8">
                                        <ul className={`space-y-4 ${idx % 2 !== 0 ? 'md:flex md:flex-col md:items-end' : ''}`}>
                                            {phase.items.map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-muted-foreground group">
                                                    {idx % 2 !== 0 && <span className="hidden md:block transition-colors group-hover:text-foreground">{item}</span>}
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 
                                                        ${phase.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground/50'}
                                                    `}>
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                    </div>
                                                    {(idx % 2 === 0 || typeof window !== 'undefined' && window.innerWidth < 768) && <span className="transition-colors group-hover:text-foreground">{item}</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="max-w-4xl mx-auto mt-32">
                    <Card variant="elevated" className="bg-foreground p-16 text-center relative overflow-hidden rounded-[3rem]">
                        <div className="absolute inset-0 bg-dot-pattern opacity-10" />
                        <div className="relative z-10">
                            <Badge variant="outline" className="mb-6 border-accent/20 bg-accent/5 text-accent-secondary">
                                FEEDBACK DRIVEN
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-display text-white mb-6">Have a feature request?</h2>
                            <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg">
                                We build STUDYHUB based on your feedback. 
                                Tell us what you want to master next, and we'll make it part of the vision.
                            </p>
                            <Button size="lg" className="rounded-full group px-12" asChild>
                                <Link to="/contact">
                                    Suggest a Feature
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default Roadmap;
