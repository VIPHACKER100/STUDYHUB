import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Target, Shield, Heart, GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const VALUES = [
    {
        icon: Heart,
        label: 'Community First',
        desc: 'Everything we do starts with the student. We build features that solve real academic problems.',
        accent: 'text-red-400',
        bg: 'bg-red-400/10',
    },
    {
        icon: Shield,
        label: 'Integrity & Trust',
        desc: 'We prioritize privacy and data security, ensuring a safe space for students to collaborate.',
        accent: 'text-accent',
        bg: 'bg-accent/10',
    },
    {
        icon: Users,
        label: 'Radical Inclusion',
        desc: 'We design for everyone. Our platform is built to be accessible to students from all walks of life.',
        accent: 'text-accent-secondary',
        bg: 'bg-accent-secondary/10',
    },
];

const stagger = {
    animate: { transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function About() {
    return (
        <div className="min-h-screen bg-background">

            {/* Hero */}
            <div className="bg-foreground pt-32 pb-20 relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <motion.div {...fadeUp}>
                        <p className="text-[10px] font-mono font-black text-accent uppercase tracking-[0.25em] mb-4">Our Story</p>
                        <h1 className="text-5xl md:text-6xl font-display text-white tracking-tight mb-6">
                            About <span className="text-accent">STUDYHUB</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                            Empowering students worldwide through collaborative intelligence and seamless resource sharing.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Mission */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-accent" />
                            </div>
                            <h2 className="text-3xl font-display text-foreground mb-6">Our Mission</h2>
                            <p className="text-muted-foreground mb-5 leading-relaxed">
                                We believe education should be a collaborative journey, not a solitary struggle.
                                STUDYHUB breaks down silos between students, enabling them to share knowledge,
                                study together in focused environments, and leverage AI to accelerate learning.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Our goal is to create the world's most accessible and intelligent study ecosystem
                                where every student has the tools they need, regardless of background or location.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-accent/20 rounded-[2.5rem] blur-3xl scale-90" />
                                <div className="relative aspect-video rounded-[2.5rem] bg-foreground border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                                    <GraduationCap className="w-40 h-40 text-white/5 absolute -right-6 -bottom-6 rotate-12" />
                                    <div className="text-center relative z-10">
                                        <div className="text-6xl font-black text-white mb-2">10M+</div>
                                        <div className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Target Students</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 border-t border-border">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-[10px] font-mono font-black text-accent uppercase tracking-[0.25em] mb-3">Principles</p>
                        <h2 className="text-3xl font-display text-foreground mb-4">Our Core Values</h2>
                        <p className="text-muted-foreground">The principles that guide everything we build at STUDYHUB.</p>
                    </div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-6"
                        variants={stagger}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {VALUES.map(({ icon: Icon, label, desc, accent, bg }) => (
                            <motion.div key={label} variants={fadeUp}>
                                <Card className="p-8 h-full hover:border-accent/20 transition-colors">
                                    <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-6`}>
                                        <Icon className={`w-6 h-6 ${accent}`} />
                                    </div>
                                    <h3 className="text-lg font-display text-foreground mb-3">{label}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-foreground rounded-[2.5rem] p-12 text-center relative overflow-hidden"
                    >
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <h2 className="text-4xl font-display text-white mb-4">Become part of the story.</h2>
                            <p className="text-muted-foreground mb-10 max-w-md mx-auto">
                                Join thousands of students who are already changing the way they learn.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button asChild className="px-8 py-4 rounded-full">
                                    <Link to="/register" className="flex items-center gap-2">
                                        Join STUDYHUB
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="px-8 py-4 rounded-full border-white/20 text-white hover:bg-white/10">
                                    <Link to="/contact">Contact Us</Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
