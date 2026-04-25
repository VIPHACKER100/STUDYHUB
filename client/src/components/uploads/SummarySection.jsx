import React, { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { aiAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function SummarySection({ uploadId, fileType }) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const isSummarizable = fileType?.includes('pdf') || fileType?.includes('text');

    const handleSummarize = async () => {
        if (!isSummarizable) {
            toast.error("AI summarization is only available for PDF or text documents");
            return;
        }

        try {
            setLoading(true);
            const res = await aiAPI.summarize(uploadId);
            setSummary(res.data.data.summary);
            setIsExpanded(true);
            toast.success("Summary generated!");
        } catch (error) {
            console.error('Summarization failed:', error);
            toast.error(error.response?.data?.message || "Failed to generate summary");
        } finally {
            setLoading(false);
        }
    };

    if (!isSummarizable && !summary) return null;

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 overflow-hidden mb-6">
            <div 
                className="p-4 flex items-center justify-between cursor-pointer group"
                onClick={() => summary && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Smart AI Summary</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Beta Feature</p>
                    </div>
                </div>

                {summary ? (
                    <button className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded-md transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-indigo-600" />}
                    </button>
                ) : (
                    <button
                        onClick={(e) => { e.stopPropagation(); handleSummarize(); }}
                        disabled={loading}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            'Generate Now →'
                        )}
                    </button>
                )}
            </div>

            {summary && isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-indigo-100 dark:border-indigo-800/20">
                    <div className="prose dark:prose-invert prose-sm max-w-none text-gray-700 dark:text-gray-300">
                        <ReactMarkdown>{summary}</ReactMarkdown>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-indigo-500 font-medium italic">
                        <FileText className="w-3 h-3" />
                        AI generated summary might contain inaccuracies.
                    </div>
                </div>
            )}
        </div>
    );
}
