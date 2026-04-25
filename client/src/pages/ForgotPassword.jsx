import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

const INPUT_BASE =
    'w-full pl-11 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground ' +
    'placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 ' +
    'focus:ring-accent/40 focus:border-accent transition-all';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/auth/forgot-password', { email });
            setSent(true);
            toast.success('Reset link sent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md"
            >
                <AnimatePresence mode="wait">
                    {sent ? (
                        /* ── Success State ─────────────────────── */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 bg-accent/20 rounded-[1.5rem] blur-xl" />
                                <div className="relative w-20 h-20 bg-accent/10 border border-accent/30 rounded-[1.5rem] flex items-center justify-center">
                                    <CheckCircle className="w-9 h-9 text-accent" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-display text-foreground mb-3">Check your inbox</h1>
                            <p className="text-muted-foreground mb-8">
                                We've sent a password reset link to{' '}
                                <span className="font-bold text-foreground">{email}</span>.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-accent font-bold hover:text-accent/80 transition-colors text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </motion.div>
                    ) : (
                        /* ── Form State ────────────────────────── */
                        <motion.div key="form">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold text-sm mb-10 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>

                            <div className="mb-8">
                                <h1 className="text-3xl font-display text-foreground tracking-tight mb-2">Forgot password?</h1>
                                <p className="text-muted-foreground">Enter your email and we'll send you a reset link.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="email" value={email} required
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={INPUT_BASE}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl">
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending link…
                                        </span>
                                    ) : 'Send Reset Link'}
                                </Button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
