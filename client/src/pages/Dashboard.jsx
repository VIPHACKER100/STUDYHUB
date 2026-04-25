import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import {
    MessageSquare, Users, BookOpen,
    Trophy, Search, Bell, TrendingUp, Sparkles, ArrowRight
} from 'lucide-react';
import RecommendationSection from '../components/dashboard/RecommendationSection';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const features = [
    {
        icon: BookOpen,
        title: 'Browse Notes',
        description: 'Access shared notes and assignments from peers',
        link: '/browse',
        accent: 'accent'
    },
    {
        icon: MessageSquare,
        title: 'Direct Messages',
        description: 'Chat privately with students and teachers',
        link: '/messages',
        accent: 'accent-secondary'
    },
    {
        icon: Users,
        title: 'Anonymous Rooms',
        description: 'Join study groups without revealing your identity',
        link: '/rooms',
        accent: 'accent'
    },
    {
        icon: Trophy,
        title: 'Leaderboard',
        description: 'See top contributors and earn achievement badges',
        link: '/leaderboard',
        accent: 'accent-secondary'
    },
];

export default function Dashboard() {
    const { user } = useAuthStore();

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            {/* Welcome Banner */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-[2.5rem] bg-foreground p-12 mb-16 shadow-2xl"
            >
                {/* Background Details */}
                <div className="absolute inset-0 bg-dot-pattern opacity-10" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-secondary/10 rounded-full blur-[80px]" />

                <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
                    <div>
                        <Badge variant="outline" className="mb-6 border-accent/20 bg-accent/5 text-accent-secondary">
                            <Sparkles className="w-3.5 h-3.5" />
                            WELCOME BACK
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
                            {user?.full_name || user?.username} <span className="text-accent">👋</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                            Your collaborative study space is active. Share knowledge, engage with peers, 
                            and master your subjects with AI-powered intelligence.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span className="text-white text-sm font-black tracking-widest uppercase">{user?.role}</span>
                        </div>
                        {user?.is_verified && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2 rounded-xl">
                                VERIFIED ACCOUNT
                            </Badge>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Feature Cards Grid */}
            <motion.section 
                variants={container}
                initial="hidden"
                animate="visible"
                className="mb-20"
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-display text-foreground tracking-tight">Quick Access</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <motion.div key={feature.title} variants={item}>
                            <Link to={feature.link} className="group block">
                                <Card className="p-8 h-full transition-all duration-300 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5">
                                    <div className={`w-14 h-14 rounded-2xl bg-${feature.accent}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                        <feature.icon className={`w-7 h-7 text-${feature.accent}`} />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{feature.description}</p>
                                    <div className="flex items-center text-xs font-black text-accent tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                        Open <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* AI Recommendations */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            >
                <RecommendationSection />
            </motion.div>

            {/* Stats Row */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20"
            >
                <h2 className="text-xl font-display text-foreground tracking-tight mb-8">Platform Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'System Role',   value: user?.role || '—',      icon: TrendingUp, color: 'accent' },
                        { label: 'Live Status',   value: 'Active',               icon: Bell,       color: 'green-500' },
                        { label: 'Verification',  value: user?.is_verified ? 'Verified' : 'Pending', icon: Search, color: 'accent-secondary' },
                        { label: 'Member Since', value: user?.created_at
                            ? new Date(user.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })
                            : '—',                                               icon: Trophy,  color: 'accent' },
                    ].map((stat) => (
                        <Card key={stat.label} className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-mono font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                <stat.icon className={`w-4 h-4 text-${stat.color}`} />
                            </div>
                            <p className="text-xl font-black text-foreground capitalize">{stat.value}</p>
                        </Card>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}




