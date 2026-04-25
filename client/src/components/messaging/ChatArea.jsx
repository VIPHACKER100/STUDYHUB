import React, { useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, MessageCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useMessageStore from '../../stores/messageStore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Button } from '../ui/Button';

export default function ChatArea({ onMobileBack }) {
    const { activeConversation, conversations, messages } = useMessageStore();
    const messagesEndRef = useRef(null);

    // Find current conversation details
    const currentConversation = conversations.find(
        (conv) => conv.id === activeConversation
    );

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!activeConversation) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-background relative overflow-hidden">
                <div className="absolute inset-0 bg-dot-pattern opacity-5" />
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center max-w-sm relative z-0"
                >
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 opacity-[0.03] select-none pointer-events-none">
                        <MessageCircle className="w-64 h-64 text-foreground" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto mb-8 rounded-[2rem] bg-accent/5 text-accent/40 flex items-center justify-center">
                            <MessageCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-display text-foreground mb-4">
                            Your Messages
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Select a peer or mentor from the sidebar to start a secure, real-time collaboration.
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-background relative">
            {/* Chat Header */}
            <motion.header 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-card border-b border-border px-6 py-4 flex items-center gap-4 z-10 shadow-sm"
            >
                {/* Mobile back button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMobileBack}
                    className="md:hidden"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>

                {/* User Avatar */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {currentConversation?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full" />
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <h2 className="font-display text-lg text-foreground truncate">
                        {currentConversation?.full_name || currentConversation?.username}
                    </h2>
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                            @{currentConversation?.username}
                        </p>
                    </div>
                </div>

                {/* Options */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl">
                        <Info className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl">
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </div>
            </motion.header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin bg-background p-6">
                <MessageList />
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Message Input */}
            <div className="px-6 pb-6 bg-background">
                <MessageInput />
            </div>
        </div>
    );
}
