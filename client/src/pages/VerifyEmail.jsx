import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';

const STATES = {
    verifying: {
        icon: Loader2,
        iconClass: 'text-accent animate-spin',
        bg: 'bg-accent/10 border-accent/30',
        glow: 'bg-accent/20',
        title: 'Verifying Email…',
    },
    success: {
        icon: CheckCircle,
        iconClass: 'text-accent',
        bg: 'bg-accent/10 border-accent/30',
        glow: 'bg-accent/20',
        title: 'Email Verified!',
    },
    error: {
        icon: XCircle,
        iconClass: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30',
        glow: 'bg-red-500/20',
        title: 'Verification Failed',
    },
};

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Hang tight while we verify your email address…');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link. Please check your email for the correct link.');
            return;
        }

        const verify = async () => {
            try {
                await axios.post('/api/auth/verify-email', { token });
                setStatus('success');
                setMessage('Your email has been confirmed. Redirecting to login in 3 seconds…');
                setTimeout(() => navigate('/login'), 3000);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
            }
        };

        verify();
    }, [searchParams, navigate]);

    const cfg = STATES[status];
    const Icon = cfg.icon;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={status}
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-md w-full text-center"
                >
                    {/* Icon block */}
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className={`absolute inset-0 ${cfg.glow} rounded-[2rem] blur-2xl scale-125`} />
                        <div className={`relative w-24 h-24 ${cfg.bg} border rounded-[2rem] flex items-center justify-center`}>
                            <Icon className={`w-11 h-11 ${cfg.iconClass}`} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-display text-foreground tracking-tight mb-3">{cfg.title}</h1>
                    <p className="text-muted-foreground mb-10 leading-relaxed">{message}</p>

                    {status === 'error' && (
                        <div className="flex flex-col gap-3">
                            <Button className="w-full py-3.5 rounded-xl" onClick={() => navigate('/login')}>
                                Go to Login
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full py-3.5 rounded-xl"
                                onClick={() => navigate('/register')}
                            >
                                Create a New Account
                            </Button>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground">
                            <Mail className="w-3.5 h-3.5" />
                            Redirecting automatically…
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
