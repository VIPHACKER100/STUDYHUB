import React from 'react';
import { Link } from 'react-router-dom';
import { 
    BookOpen, 
    Github, 
    Twitter, 
    Linkedin,
    Globe,
    Mail,
    Phone
} from 'lucide-react';
import { Button } from '../ui/Button';

const Footer = () => {
    return (
        <footer className="bg-background pt-24 pb-12 border-t border-border">
            <div className="max-w-6xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-8 group">
                            <div className="bg-accent p-2.5 rounded-xl text-white shadow-accent group-hover:scale-110 transition-transform">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <span className="font-display text-3xl tracking-tight">STUDYHUB</span>
                        </Link>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mb-6">
                            The precision-engineered intelligence layer for collaborative academic mastery. Built for the modern student.
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                <span className="text-accent font-bold">Developer:</span> Aryan Ahirwar
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                <a href="mailto:viphacker.100.org@gmail.com" className="hover:text-accent flex items-center gap-1 transition-colors">
                                    <Mail className="w-3 h-3" /> viphacker.100.org@gmail.com
                                </a>
                                <a href="tel:+917389718429" className="hover:text-accent flex items-center gap-1 transition-colors">
                                    <Phone className="w-3 h-3" /> +91 7389718429
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-display text-lg mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                            {["Features", "About", "Roadmap", "Help Center"].map(item => (
                                <li key={item}>
                                    <Link to={`/${item.toLowerCase().replace(' ', '')}`} className="hover:text-accent transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display text-lg mb-6">Connect</h4>
                        <div className="flex gap-4 mb-8">
                            <a href="https://github.com/viphacker.100" target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent/5 hover:text-accent">
                                    <Github className="w-5 h-5" />
                                </Button>
                            </a>
                            <a href="https://viphacker100.com" target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent/5 hover:text-accent">
                                    <Globe className="w-5 h-5" />
                                </Button>
                            </a>
                            <a href="https://linkedin.com/in/viphacker100" target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent/5 hover:text-accent">
                                    <Linkedin className="w-5 h-5" />
                                </Button>
                            </a>
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                            Madhya Pradesh, India
                        </p>
                    </div>
                </div>
                
                <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">
                        © 2026 STUDYHUB • Developed by <span className="text-accent font-bold">VIPHACKER.100</span>
                    </p>
                    <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
                        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
