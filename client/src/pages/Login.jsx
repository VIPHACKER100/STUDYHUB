import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useAuthStore from '../stores/authStore';
import { Mail, Lock, LogIn, BookOpen, Users, Sparkles, ArrowRight, User } from 'lucide-react';
import { Button } from '../components/ui/Button';

const INPUT_BASE =
    'w-full pl-11 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground ' +
    'placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 ' +
    'focus:ring-accent/40 focus:border-accent transition-all';

export default function Login() {
    const navigate = useNavigate();
    const { login, loading } = useAuthStore();
    const [formData, setFormData] = useState({ identifier: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData.identifier, formData.password);
        if (result.success) {
            toast.success('Welcome back!');
            navigate('/dashboard');
        } else {
            toast.error(result.error || 'Login failed');
        }
    };

    const handleChange = (e) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    return (
        <div className="min-h-screen flex">
            {/* ── Left Brand Panel ─────────────────────────────────── */}
            <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 bg-foreground p-12 relative overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-32 -right-16 w-64 h-64 bg-accent-secondary/10 rounded-full blur-[80px]" />

                <Link to="/" className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-white font-display text-xl tracking-tight">StudyHub</span>
                </Link>

                <div className="relative z-10">
                    <h2 className="text-4xl font-display text-white leading-tight mb-6">
                        Your collaborative <span className="text-accent">study space</span> awaits.
                    </h2>
                    <div className="space-y-4">
                        {[
                            { icon: Sparkles, text: 'AI-curated note recommendations' },
                            { icon: Users,    text: 'Anonymous study rooms with cryptonyms' },
                            { icon: BookOpen, text: 'Shared notes, assignments & study materials' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-accent" />
                                </div>
                                <p className="text-muted-foreground text-sm">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-muted-foreground text-xs">© 2025 StudyHub. All rights reserved.</p>
            </div>

            {/* ── Right Form Panel ─────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10">
                        {/* Mobile logo */}
                        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-accent" />
                            </div>
                            <span className="font-display text-foreground">StudyHub</span>
                        </Link>
                        <h1 className="text-3xl font-display text-foreground tracking-tight mb-2">Welcome back</h1>
                        <p className="text-muted-foreground">Sign in to continue your learning journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">Email or Username</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text" name="identifier" value={formData.identifier}
                                    onChange={handleChange} required
                                    className={INPUT_BASE}
                                    placeholder="you@example.com or username"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-bold text-foreground">Password</label>
                                <Link to="/forgot-password" className="text-xs font-bold text-accent hover:text-accent/80 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password" name="password" value={formData.password}
                                    onChange={handleChange} required
                                    className={INPUT_BASE}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl text-sm mt-2">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                    <ArrowRight className="w-4 h-4 ml-auto" />
                                </span>
                            )}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground pt-2">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-black text-accent hover:text-accent/80 transition-colors">
                                Create one free
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
