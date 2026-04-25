import React, { useState } from 'react';
import { Search, MessageSquarePlus, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import useMessageStore from '../../stores/messageStore';
import useAuthStore from '../../stores/authStore';
import NewConversationModal from './NewConversationModal';
import { Badge } from '../ui/Badge';

export default function ConversationSidebar() {
    const { conversations, activeConversation, selectConversation } = useMessageStore();
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

    const filteredConversations = conversations.filter((conv) =>
        conv.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diffInHours = (now - date) / (1000 * 60 * 60);

            if (diffInHours < 24) {
                return format(date, 'HH:mm');
            } else if (diffInHours < 48) {
                return 'Yesterday';
            } else if (diffInHours < 168) {
                return format(date, 'EEE');
            } else {
                return format(date, 'MMM d');
            }
        } catch (error) {
            return '';
        }
    };

    return (
        <div className="h-full flex flex-col bg-card">
            {/* Search Header */}
            <div className="p-6 border-b border-border space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-display text-foreground">Chats</h2>
                    <button
                        onClick={() => setIsNewChatModalOpen(true)}
                        className="p-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl transition-all hover:scale-105 active:scale-95"
                    >
                        <MessageSquarePlus className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-transparent focus:border-accent/30 focus:bg-background rounded-xl text-sm transition-all outline-none"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
                <AnimatePresence mode="popLayout">
                    {filteredConversations.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 px-6"
                        >
                            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquarePlus className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <p className="text-muted-foreground text-sm font-medium">
                                {searchTerm ? 'No results found' : 'No conversations yet'}
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-1">
                            {filteredConversations.map((conversation) => (
                                <motion.button
                                    layout
                                    key={conversation.id}
                                    onClick={() => selectConversation(conversation.id)}
                                    className={`w-full p-4 rounded-2xl transition-all duration-200 text-left group relative ${
                                        activeConversation === conversation.id
                                            ? 'bg-foreground text-white shadow-lg'
                                            : 'hover:bg-muted text-foreground'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border-2 ${
                                                activeConversation === conversation.id ? 'border-white/20 bg-accent' : 'border-background bg-gradient-to-br from-accent to-accent-secondary text-white'
                                            }`}>
                                                {conversation.username?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            {conversation.unread_count > 0 && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-card animate-pulse">
                                                    {conversation.unread_count}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h3 className={`font-bold truncate ${activeConversation === conversation.id ? 'text-white' : 'text-foreground'}`}>
                                                    {conversation.full_name || conversation.username}
                                                </h3>
                                                <span className={`text-[10px] font-mono uppercase tracking-tighter ${activeConversation === conversation.id ? 'text-white/60' : 'text-muted-foreground'}`}>
                                                    {formatTime(conversation.last_message_at)}
                                                </span>
                                            </div>
                                            <p className={`text-xs truncate ${activeConversation === conversation.id ? 'text-white/70' : 'text-muted-foreground'}`}>
                                                {conversation.last_message || 'Start a conversation...'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Active Indicator Bar */}
                                    {activeConversation === conversation.id && (
                                        <motion.div 
                                            layoutId="active-bar"
                                            className="absolute left-1 top-4 bottom-4 w-1 bg-accent rounded-full" 
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* New Conversation Modal */}
            <AnimatePresence>
                {isNewChatModalOpen && (
                    <NewConversationModal onClose={() => setIsNewChatModalOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}
