import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, MessageSquare, Users, BookOpen,
    Trophy, User, LogOut, Shield, Menu, X, GraduationCap,
    Bell, Settings, ChevronDown
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import NotificationBell from './NotificationBell';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const NAV_LINKS = [
    { to: '/dashboard',   label: 'Dashboard',  icon: LayoutDashboard },
    { to: '/browse',      label: 'Browse',     icon: BookOpen },
    { to: '/messages',    label: 'Messages',   icon: MessageSquare },
    { to: '/rooms',       label: 'Rooms',      icon: Users },
    { to: '/leaderboard', label: 'Rankings',   icon: Trophy },
];

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border py-3' : 'bg-background border-b border-transparent py-5'
        }`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-12">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0 group relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-display tracking-tight text-foreground group-hover:text-accent transition-colors">
                            STUDYHUB
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center bg-muted/50 p-1.5 rounded-full border border-border/50 backdrop-blur-sm">
                        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                                    isActive(to)
                                        ? 'text-white'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {isActive(to) && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-accent rounded-full -z-10 shadow-lg shadow-accent/20"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-border">
                            <NotificationBell />
                            {user?.role === 'admin' && (
                                <Link to="/admin">
                                    <Button variant="ghost" size="sm" className="w-9 h-9 rounded-full p-0 text-muted-foreground hover:text-accent">
                                        <Shield className="w-5 h-5" />
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Profile Dropdown Simulation */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/profile')}
                                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-muted transition-colors group"
                            >
                                <div className="w-9 h-9 rounded-full bg-accent border-2 border-background shadow-md flex items-center justify-center text-white font-black text-sm group-hover:scale-105 transition-transform">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-xs font-black text-foreground leading-none">
                                        {user?.full_name?.split(' ')[0] || user?.username}
                                    </p>
                                    <p className="text-[10px] font-mono text-accent uppercase tracking-widest mt-1">
                                        {user?.role}
                                    </p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-muted text-foreground"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-0 right-0 bg-background border-b border-border md:hidden overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 space-y-2">
                            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                                        isActive(to)
                                            ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {label}
                                </Link>
                            ))}
                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold text-red-500 hover:bg-red-50"
                                >
                                    <Shield className="w-5 h-5" />
                                    Admin Console
                                </Link>
                            )}
                            <div className="pt-4 mt-4 border-t border-border">
                                <Link
                                    to="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold text-foreground hover:bg-muted"
                                >
                                    <User className="w-5 h-5" />
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
