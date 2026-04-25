import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import { Button } from '../ui/Button';

const PublicNavbar = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-secondary rounded-xl flex items-center justify-center shadow-accent group-hover:scale-110 transition-transform">
                            <BookOpen className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-display tracking-tight text-foreground">STUDYHUB</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center space-x-8">
                        {['Features', 'About', 'Roadmap', 'Contact'].map((item) => (
                            <Link 
                                key={item} 
                                to={`/${item.toLowerCase()}`} 
                                className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-6">
                        {isAuthenticated ? (
                            <Button asChild className="rounded-full">
                                <Link to="/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                                    Log in
                                </Link>
                                <Button className="rounded-full group">
                                    <Link to="/register" className="flex items-center gap-2">
                                        Sign Up
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;

