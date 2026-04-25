import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Sparkles, Download, Star, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const fetchRecommendations = async () => {
    const res = await axios.get('/api/recommendations');
    return res.data.data;
};

export default function RecommendationSection() {
    const { data: recommendations, isLoading, isError } = useQuery({
        queryKey: ['recommendations'],
        queryFn: fetchRecommendations,
        staleTime: 15 * 60 * 1000, // 15 mins
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="h-48 animate-pulse bg-muted/50 border-none" />
                ))}
            </div>
        );
    }

    if (isError || !recommendations?.length) return null;

    return (
        <section className="mt-16">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-xl font-display text-foreground tracking-tight">Recommended Intelligence</h2>
                        <p className="text-sm text-muted-foreground">AI-curated resources based on your study patterns</p>
                    </div>
                </div>
                <Button variant="ghost" className="text-accent font-bold" asChild>
                    <Link to="/browse">
                        Browse all <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((item) => (
                    <Link
                        key={item.id}
                        to={`/browse?id=${item.id}`}
                        className="group"
                    >
                        <Card className="p-8 h-full transition-all duration-300 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <Badge variant="outline" className="border-accent/20 text-accent bg-accent/5">
                                    {item.subject}
                                </Badge>
                                <div className="flex items-center gap-1.5 text-accent-secondary">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-black">{item.averageRating || '0.0'}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-accent transition-colors leading-tight">
                                {item.title}
                            </h3>

                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-black text-foreground capitalize border border-border">
                                        {item.uploaderName?.[0]}
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground">{item.uploaderName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                    <Download className="w-3 h-3" />
                                    <span>{item.downloadCount}</span>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}




