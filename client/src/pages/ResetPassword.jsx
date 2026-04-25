import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Lock, ArrowLeft, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const INPUT_BASE =
    'w-full pl-11 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground ' +
    'placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 ' +
    'focus:ring-accent/40 focus:border-accent transition-all';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return toast.error('Passwords do not match');
        if (password.length < 6) return toast.error('Password must be at least 6 characters');

        setLoading(true);
        try {
            await axios.post('/api/auth/reset-password', { token, newPassword: password });
            setSuccess(true);
            toast.success('Password reset successfully!');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    // ── Invalid token ────────────────────────────────────────────────────────
    if (!token) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 bg-red-500/20 rounded-[1.5rem] blur-xl" />
                        <div className="relative w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-[1.5rem] flex items-center justify-center">
                            <AlertCircle className="w-9 h-9 text-red-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-display text-foreground mb-3">Invalid Link</h1>
                    <p className="text-muted-foreground mb-8">
                        This password reset link is invalid or has expired.
                    </p>
                    <Button asChild className="rounded-xl px-6 py-3">
                        <Link to="/forgot-password" className="flex items-center gap-2">
                            Request a new link
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md"
            >
                <AnimatePresence mode="wait">
                    {success ? (
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
                            <h1 className="text-2xl font-display text-foreground mb-3">Password Reset!</h1>
                            <p className="text-muted-foreground mb-8">
                                Your password has been updated. Redirecting you to login…
                            </p>
                            <Button asChild className="rounded-xl px-6 py-3">
                                <Link to="/login">Go to Login</Link>
                            </Button>
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
                                <h1 className="text-3xl font-display text-foreground tracking-tight mb-2">
                                    Reset Password
                                </h1>
                                <p className="text-muted-foreground">Create a strong new password for your account.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-2">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="password" required minLength={6}
                                            value={password} onChange={e => setPassword(e.target.value)}
                                            className={INPUT_BASE} placeholder="Min. 6 characters"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="password" required minLength={6}
                                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                            className={INPUT_BASE} placeholder="Repeat new password"
                                        />
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="mt-1.5 text-xs text-red-400 font-mono">Passwords don't match</p>
                                    )}
                                </div>

                                <Button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl mt-2">
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Resetting…
                                        </span>
                                    ) : 'Reset Password'}
                                </Button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
