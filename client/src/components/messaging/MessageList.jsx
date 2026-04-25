import React from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import useMessageStore from '../../stores/messageStore';
import useAuthStore from '../../stores/authStore';
import MessageBubble from './MessageBubble';

export default function MessageList() {
    const { messages, loading, typingUsers } = useMessageStore();
    const { user } = useAuthStore();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest animate-pulse">
                    Syncing Messages...
                </p>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2 opacity-50">
                    <p className="font-display text-lg text-foreground">
                        No messages yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Send a greeting to start the conversation!
                    </p>
                </div>
            </div>
        );
    }

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
        const date = format(new Date(message.created_at), 'yyyy-MM-dd');
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    const formatDateHeader = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
            return 'Today';
        } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
            return 'Yesterday';
        } else {
            return format(date, 'MMMM d, yyyy');
        }
    };

    return (
        <div className="space-y-8">
            <AnimatePresence mode="popLayout">
                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date} className="space-y-6">
                        {/* Date Separator */}
                        <div className="flex items-center justify-center">
                            <div className="flex items-center gap-4 w-full">
                                <div className="h-px flex-1 bg-border/50" />
                                <span className="bg-muted px-4 py-1 rounded-full text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                                    {formatDateHeader(date)}
                                </span>
                                <div className="h-px flex-1 bg-border/50" />
                            </div>
                        </div>

                        {/* Messages for this date */}
                        <div className="space-y-4">
                            {dateMessages.map((message, index) => {
                                const isOwnMessage = message.sender_id === user?.id;
                                const showAvatar =
                                    !isOwnMessage &&
                                    (index === dateMessages.length - 1 ||
                                        dateMessages[index + 1]?.sender_id !== message.sender_id);

                                return (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, x: isOwnMessage ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        layout
                                    >
                                        <MessageBubble
                                            message={message}
                                            isOwnMessage={isOwnMessage}
                                            showAvatar={showAvatar}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {typingUsers.size > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl w-fit"
                >
                    <div className="flex gap-1.5 px-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">
                        Collaborator is typing...
                    </span>
                </motion.div>
            )}
        </div>
    );
}
