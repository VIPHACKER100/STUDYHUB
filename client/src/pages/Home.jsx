import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    BookOpen, 
    MessageSquare, 
    Shield, 
    Trophy, 
    Zap, 
    Globe, 
    ArrowRight,
    Users,
    Sparkles,
    CheckCircle2,
    Github,
    Twitter,
    Linkedin
} from 'lucide-react';
import useAuthStore from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const Home = () => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="bg-background min-h-screen font-sans selection:bg-accent selection:text-white overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-44">
                {/* Background Textures */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-accent/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-[-5%] w-[35rem] h-[35rem] bg-accent/3 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="text-left"
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge className="mb-8">
                                Intelligence Layer Phase 5 is Live
                            </Badge>
                        </motion.div>
                        
                        <motion.h1 
                            variants={fadeInUp}
                            className="text-6xl lg:text-[5.25rem] font-display leading-[1.05] tracking-tight text-foreground mb-8"
                        >
                            The smartest way to <br />
                            <span className="gradient-text relative">
                                Collaborate & Learn
                                <span className="absolute bottom-2 left-0 h-4 w-full bg-accent/10 -z-10 rounded-sm" />
                            </span>
                        </motion.h1>

                        <motion.p 
                            variants={fadeInUp}
                            className="text-xl text-muted-foreground max-w-xl mb-12 leading-relaxed"
                        >
                            StudyHub is a precision-engineered educational platform combining file sharing, real-time messaging, and AI-powered intelligence for the modern student.
                        </motion.p>

                        <motion.div 
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row items-center gap-4"
                        >
                            <Button size="lg" className="group w-full sm:w-auto">
                                <Link to="/register" className="flex items-center gap-2">
                                    Start Learning Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                                <Link to="/login">Platform Login</Link>
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Animated Hero Graphic */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative aspect-square w-full max-w-[440px] mx-auto">
                            {/* Rotating Ring */}
                            <div className="absolute inset-0 border-[1px] border-dashed border-accent/20 rounded-full animate-rotate-slow" />
                            
                            {/* Floating Elements */}
                            <motion.div 
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 right-0 z-20"
                            >
                                <Card className="p-5 w-48 shadow-2xl border-accent/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-white">
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <div className="h-2 w-16 bg-muted rounded" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-muted rounded" />
                                        <div className="h-2 w-3/4 bg-muted rounded" />
                                    </div>
                                </Card>
                            </motion.div>

                            <motion.div 
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-10 left-0 z-20"
                            >
                                <Card className="p-5 w-56 shadow-2xl border-accent/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Users className="w-5 h-5 text-accent" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Live Rooms</span>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-7 w-7 rounded-full border-2 border-card bg-muted" />
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>

                            {/* Center Element */}
                            <div className="absolute inset-0 m-auto w-32 h-32 bg-gradient-to-br from-accent to-accent-secondary rounded-3xl shadow-accent-lg flex items-center justify-center rotate-12">
                                <BookOpen className="w-12 h-12 text-white -rotate-12" />
                            </div>

                            {/* Decorative Dots */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 bg-dot-pattern pointer-events-none" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section (Inverted Contrast) */}
            <section className="py-28 bg-foreground text-background relative overflow-hidden">
                <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none" />
                <div className="max-w-6xl mx-auto px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: "Notes Shared", value: "50k+" },
                            { label: "Active Students", value: "10k+" },
                            { label: "Satisfaction", value: "99%" },
                            { label: "AI Support", value: "24/7" },
                        ].map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                            >
                                <div className="text-5xl font-display mb-2 gradient-text">{stat.value}</div>
                                <div className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 lg:py-44 px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-24">
                        <Badge className="mb-6">Our Capabilities</Badge>
                        <h2 className="text-4xl md:text-5xl font-display mb-6 tracking-tight">
                            Minimalist tools for <span className="gradient-text">maximum growth</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                            Everything you need to succeed academically, delivered through a interface that prioritizes clarity and focus.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-10 group">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-accent">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">AI Smart Summary</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Upload your PDFs and let our Gemini AI extract key takeaways and generate 3-sentence overviews instantly.
                            </p>
                        </Card>

                        <Card variant="featured">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white mb-8 shadow-accent">
                                <Users className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight text-foreground">Anonymous Rooms</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Join subject-specific study rooms with random identities. Focus on the learning, not the social pressure.
                            </p>
                            <div className="mt-8 pt-8 border-t border-border flex items-center gap-2 text-accent font-bold text-sm">
                                Explore Rooms <ArrowRight className="w-4 h-4" />
                            </div>
                        </Card>

                        <Card className="p-10 group">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-accent">
                                <Trophy className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">Gamified Growth</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Earn points for sharing, collect unique badges, and climb the global contributor leaderboard.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 lg:py-32 px-8 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-foreground text-background rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center shadow-2xl">
                        <div className="absolute inset-0 bg-dot-pattern opacity-[0.05] pointer-events-none" />
                        <div className="absolute top-[-20%] left-[-10%] w-[30rem] h-[30rem] bg-accent/20 rounded-full blur-[120px]" />
                        
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-display mb-8 leading-[1.1] tracking-tight">
                                Ready to level up your <br />
                                <span className="gradient-text">study game?</span>
                            </h2>
                            <p className="text-muted-foreground text-xl mb-12 max-w-xl mx-auto">
                                Join the StudyHub community today and experience a new era of collaborative learning.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="lg" className="w-full sm:w-auto h-16 px-12 text-xl">
                                    <Link to="/register">Get Started Free</Link>
                                </Button>
                                <Button variant="secondary" size="lg" className="w-full sm:w-auto h-16 px-12 text-xl text-background hover:text-foreground">
                                    <Link to="/help">Help Center</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Footer */}
            <footer className="bg-background pt-24 pb-12 border-t border-border">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-2">
                            <Link to="/" className="flex items-center gap-3 mb-8 group">
                                <div className="bg-accent p-2.5 rounded-xl text-white shadow-accent group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <span className="font-display text-3xl tracking-tight">STUDYHUB</span>
                            </Link>
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                                The precision-engineered intelligence layer for collaborative academic mastery. Built for the modern student.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-display text-lg mb-6">Platform</h4>
                            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                                {["Features", "About", "Roadmap", "Help Center"].map(item => (
                                    <li key={item}>
                                        <Link to={`/${item.toLowerCase().replace(' ', '')}`} className="hover:text-accent transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-display text-lg mb-6">Connect</h4>
                            <div className="flex gap-4 mb-8">
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent/5 hover:text-accent">
                                    <Github className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent/5 hover:text-accent">
                                    <Twitter className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent/5 hover:text-accent">
                                    <Linkedin className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">
                            © 2026 STUDYHUB • All Rights Reserved
                        </p>
                        <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
                            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
