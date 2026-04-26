import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Zap, Users, Trophy, BookOpen, MessageSquare, Shield, ArrowRight, Sparkles, CheckCircle2, Lock, Terminal 
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const Features = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
    };

    const stagger = {
        visible: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section (Inverted) */}
            <section className="relative pt-40 pb-32 overflow-hidden bg-foreground">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-secondary/5 rounded-full blur-[100px] -ml-48 -mb-48" />
                
                <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <Badge variant="outline" className="mb-6 border-accent/30 bg-accent/5 text-accent-secondary">
                            <Sparkles className="w-3.5 h-3.5" />
                            EVOLVED EDUCATION
                        </Badge>
                        <h1 className="text-4xl md:text-7xl font-display text-white mb-8 leading-[1.1]">
                            Designed for Modern <br/> <span className="gradient-text">Collaborative Learning</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            We've engineered a suite of powerful tools to help you manage materials, 
                            collaborate without friction, and leverage AI for academic mastery.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Feature Pillars */}
            <div className="max-w-6xl mx-auto px-6 py-32 space-y-48">
                
                {/* Pillar 1: AI Intelligence */}
                <section className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <Badge variant="outline" className="mb-6 text-accent border-accent/20">INTELLIGENCE LAYER</Badge>
                        <h2 className="text-3xl md:text-5xl font-display text-foreground mb-8">AI-Powered Note <span className="gradient-text">Intelligence</span></h2>
                        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                            Don't just store your notes—understand them. Our neural processing layer analyzes your PDFs to extract core concepts and generate mastery-level insights.
                        </p>
                        <ul className="space-y-6">
                            {[
                                "Instant 3-sentence overviews of complex material",
                                "Key Takeaway extraction for accelerated review",
                                "Smart Recommendations based on your study patterns"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-foreground group">
                                    <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Zap className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Card variant="featured" className="p-1">
                            <div className="bg-card rounded-[calc(1rem-2px)] p-10 shadow-2xl">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="h-3 bg-muted rounded-full w-3/4 animate-pulse" />
                                        <div className="h-3 bg-muted rounded-full w-full animate-pulse" />
                                        <div className="h-3 bg-muted rounded-full w-5/6 animate-pulse" />
                                    </div>
                                    <div className="pt-8 border-t border-border">
                                        <Badge className="mb-4 bg-accent text-white border-none">AI SUMMARY</Badge>
                                        <div className="p-6 bg-accent/5 rounded-2xl italic text-foreground text-lg leading-relaxed border border-accent/10">
                                            "This document covers the core principles of React State management, focusing on Hooks and the Context API for efficient data flow..."
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </section>

                {/* Pillar 2: Anonymous Collaboration */}
                <section className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-2 lg:order-1"
                    >
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-transparent blur-2xl rounded-[3rem]" />
                            <Card className="relative p-10 space-y-6 bg-foreground text-white border-none overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-dot-pattern opacity-10" />
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-sm font-medium">Anonymous Owl: "Does anyone understand the third law?"</div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-accent/20 rounded-2xl border border-accent/30 backdrop-blur-sm self-end ml-12">
                                    <div className="text-sm font-medium">You (Brave Lion): "I can help! Here is a simple explanation..."</div>
                                    <div className="w-10 h-10 rounded-full bg-accent-secondary flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="order-1 lg:order-2"
                    >
                        <Badge variant="outline" className="mb-6 text-accent-secondary border-accent-secondary/20">ZERO FRICTION</Badge>
                        <h2 className="text-3xl md:text-5xl font-display text-foreground mb-8">Anonymous <span className="gradient-text">Collaboration</span></h2>
                        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                            Join subject-specific study rooms where focus is the only priority. No social pressure, no judgment—just pure collaborative mastery.
                        </p>
                        <ul className="space-y-6">
                            {[
                                { icon: Shield, text: "Randomized identities for safe questioning" },
                                { icon: MessageSquare, text: "Real-time cryptonym chat with peers" },
                                { icon: Users, text: "Moderated zones for zero-distraction study" }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-foreground group">
                                    <div className="w-6 h-6 rounded-full bg-accent-secondary/10 text-accent-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <item.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-medium">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </section>

                {/* Pillar 3: Gamification */}
                <section className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <Badge variant="outline" className="mb-6 text-accent border-accent/20">RECOGNITION ENGINE</Badge>
                        <h2 className="text-3xl md:text-5xl font-display text-foreground mb-8">Gamified <span className="gradient-text">Recognition</span></h2>
                        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                            Your contributions drive the community. Earn digital prestige for helping others and climb the global ranks through meaningful academic engagement.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <Card className="p-6 border-accent/10 bg-accent/5 hover:bg-accent/10 transition-colors">
                                <Trophy className="w-8 h-8 text-accent mb-4" />
                                <div className="font-bold text-foreground mb-1">Leaderboards</div>
                                <div className="text-sm text-muted-foreground">Top contributors ranked monthly</div>
                            </Card>
                            <Card className="p-6 border-accent-secondary/10 bg-accent-secondary/5 hover:bg-accent-secondary/10 transition-colors">
                                <Sparkles className="w-8 h-8 text-accent-secondary mb-4" />
                                <div className="font-bold text-foreground mb-1">Elite Badges</div>
                                <div className="text-sm text-muted-foreground">Earn rewards for specific milestones</div>
                            </Card>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Card variant="featured" className="p-16 text-center group overflow-hidden relative">
                            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <Trophy className="w-24 h-24 mx-auto mb-8 text-accent drop-shadow-[0_0_15px_rgba(0,82,255,0.4)] group-hover:scale-110 transition-transform duration-500 relative z-10" />
                            <h3 className="text-3xl font-display text-foreground mb-4 relative z-10">Rising Star Badge</h3>
                            <p className="text-muted-foreground text-lg relative z-10">Earned for sharing 5 high-precision notes</p>
                            <div className="mt-8 flex justify-center gap-1 relative z-10">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent" />
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </section>

                {/* Pillar 4: Cyber-Hardened Foundation */}
                <section className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-2 lg:order-1"
                    >
                        <Card className="p-10 bg-slate-950 border-accent/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Terminal className="w-24 h-24 text-accent" />
                            </div>
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
                                        <Lock className="w-6 h-6 text-accent" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">Security-First Architecture</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-2 bg-accent/10 rounded-full w-full overflow-hidden">
                                        <motion.div 
                                            initial={{ x: "-100%" }}
                                            whileInView={{ x: "0%" }}
                                            transition={{ duration: 2, ease: "easeInOut" }}
                                            className="h-full bg-accent w-full"
                                        />
                                    </div>
                                    <p className="text-sm text-slate-400 font-mono">
                                        $ studyhub --audit-vulnerabilities<br/>
                                        <span className="text-accent">SUCCESS:</span> All systems nominal. Hardened by VIPHACKER.100
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="order-1 lg:order-2"
                    >
                        <Badge variant="outline" className="mb-6 text-accent border-accent/20 uppercase tracking-widest">Architected for Trust</Badge>
                        <h2 className="text-3xl md:text-5xl font-display text-foreground mb-8">Cyber-Hardened <span className="gradient-text">Foundation</span></h2>
                        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                            Built by a cybersecurity researcher, STUDYHUB goes beyond standard protocols. Our platform is designed with the same rigor used in ethical hacking labs.
                        </p>
                        <ul className="space-y-6">
                            {[
                                { icon: Shield, text: "Privacy-centric data encryption layers" },
                                { icon: Lock, text: "Advanced API vulnerability shielding" },
                                { icon: Terminal, text: "Inspired by DarkWin-OS security principles" }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-foreground group">
                                    <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <item.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-medium">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </section>
            </div>

            {/* CTA Section */}
            <section className="py-32 bg-foreground relative overflow-hidden text-center px-6">
                <div className="absolute inset-0 bg-dot-pattern opacity-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px]" />
                
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="relative z-10"
                >
                    <h2 className="text-4xl md:text-6xl font-display text-white mb-10 leading-tight">
                        Ready to experience <br/> the <span className="gradient-text">future?</span>
                    </h2>
                    <Button size="lg" className="rounded-full h-16 px-12 text-lg font-bold group" asChild>
                        <Link to="/register">
                            Join STUDYHUB Now
                            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </Button>
                </motion.div>
            </section>
        </div>
    );
};

export default Features;
