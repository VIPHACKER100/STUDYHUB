import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useAuthStore from '../stores/authStore';
import { Mail, Lock, User, UserPlus, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const INPUT_BASE =
    'w-full pl-11 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground ' +
    'placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 ' +
    'focus:ring-accent/40 focus:border-accent transition-all';

const INPUT_BARE =
    'w-full px-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground ' +
    'placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 ' +
    'focus:ring-accent/40 focus:border-accent transition-all';

export default function Register() {
    const navigate = useNavigate();
    const { register, loading } = useAuthStore();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        role: 'student',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(formData);
        if (result.success) {
            toast.success('Account created! Welcome to StudyHub 🎉');
            navigate('/dashboard');
        } else {
            toast.error(result.error || 'Registration failed');
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
                        Join thousands of <span className="text-accent">students & educators</span>.
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {[
                            { value: '10K+', label: 'Study Materials' },
                            { value: '5K+', label: 'Active Users' },
                            { value: '200+', label: 'Study Rooms' },
                            { value: '4.9★', label: 'User Rating' },
                        ].map(({ value, label }) => (
                            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-2xl font-black text-white mb-0.5">{value}</p>
                                <p className="text-muted-foreground text-xs">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-muted-foreground text-xs">© 2025 StudyHub. All rights reserved.</p>
            </div>

            {/* ── Right Form Panel ─────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md py-8"
                >
                    <div className="mb-10">
                        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-accent" />
                            </div>
                            <span className="font-display text-foreground">StudyHub</span>
                        </Link>
                        <h1 className="text-3xl font-display text-foreground tracking-tight mb-2">Create your account</h1>
                        <p className="text-muted-foreground">Join the collaborative learning community.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">Username</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text" name="username" value={formData.username}
                                    onChange={handleChange} required
                                    className={INPUT_BASE}
                                    placeholder="aryan "
                                />
                            </div>
                        </div>

                        {/* Full name */}
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">Full Name <span className="text-muted-foreground font-normal">(optional)</span></label>
                            <input
                                type="text" name="fullName" value={formData.fullName}
                                onChange={handleChange}
                                className={INPUT_BARE}
                                placeholder="Aryan"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email" name="email" value={formData.email}
                                    onChange={handleChange} required
                                    className={INPUT_BASE}
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password" name="password" value={formData.password}
                                    onChange={handleChange} required minLength={6}
                                    className={INPUT_BASE}
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        </div>

                        {/* Role picker */}
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-3">I am a…</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: 'student', label: 'Student', icon: GraduationCap },
                                    { value: 'teacher', label: 'Teacher', icon: User },
                                ].map(({ value, label, icon: Icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, role: value }))}
                                        className={`flex items-center justify-center gap-2.5 py-3.5 rounded-xl border-2 text-sm font-bold transition-all ${formData.role === value
                                            ? 'border-accent bg-accent/5 text-accent'
                                            : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl text-sm mt-2">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Create Account
                                    <ArrowRight className="w-4 h-4 ml-auto" />
                                </span>
                            )}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground pt-2">
                            Already have an account?{' '}
                            <Link to="/login" className="font-black text-accent hover:text-accent/80 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
