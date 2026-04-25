import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard, ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md w-full text-center"
            >
                {/* 404 Visual */}
                <div className="relative mb-12 select-none">
                    <div className="text-[11rem] font-black text-foreground/5 leading-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent/30 rounded-[1.5rem] blur-2xl scale-150" />
                            <div className="relative w-24 h-24 bg-foreground rounded-[1.5rem] rotate-12 flex items-center justify-center shadow-2xl shadow-foreground/20">
                                <Ghost className="w-11 h-11 text-accent" />
                            </div>
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-display text-foreground tracking-tight mb-4">
                    Page lost in space
                </h1>
                <p className="text-muted-foreground mb-10 leading-relaxed">
                    The page you're looking for was moved, removed, or never existed.
                </p>

                <div className="flex flex-col gap-3">
                    <Button asChild className="w-full py-4 rounded-xl">
                        <Link to="/" className="flex items-center justify-center gap-2">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full py-4 rounded-xl">
                        <Link to="/dashboard" className="flex items-center justify-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Go to Dashboard
                        </Link>
                    </Button>
                </div>

                <button
                    onClick={() => window.history.back()}
                    className="mt-8 text-muted-foreground hover:text-accent font-bold flex items-center gap-2 mx-auto transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </button>
            </motion.div>
        </div>
    );
}
