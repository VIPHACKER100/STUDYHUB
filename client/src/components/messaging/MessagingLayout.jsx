import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationSidebar from './ConversationSidebar';
import ChatArea from './ChatArea';
import useAuthStore from '../../stores/authStore';
import useMessageStore from '../../stores/messageStore';
import socketService from '../../services/socket';
import { Button } from '../ui/Button';

export default function MessagingLayout() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { fetchConversations, activeConversation, addMessage, setUserTyping } = useMessageStore();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);

    useEffect(() => {
        // Fetch conversations on mount
        fetchConversations();

        // Setup Socket.io listeners
        socketService.onNewMessage((message) => {
            addMessage(message);
            fetchConversations(); // Refresh conversation list
        });

        socketService.onUserTyping(({ userId, username }) => {
            setUserTyping(userId, true);
            // Auto-clear after 3 seconds
            setTimeout(() => setUserTyping(userId, false), 3000);
        });

        socketService.onUserStoppedTyping(({ userId }) => {
            setUserTyping(userId, false);
        });

        return () => {
            // Cleanup listeners
            socketService.removeAllListeners();
        };
    }, []);

    // Close sidebar on mobile when conversation selected
    useEffect(() => {
        if (activeConversation && window.innerWidth < 768) {
            setIsMobileSidebarOpen(false);
        }
    }, [activeConversation]);

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden">
            {/* Header */}
            <header className="bg-foreground text-white border-b border-white/10 px-6 py-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/dashboard')}
                        className="text-white hover:bg-white/10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-accent" />
                            <h1 className="text-xl font-display">Messages</h1>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-0.5">
                            Signed in as {user?.username}
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar */}
                <motion.div
                    initial={false}
                    animate={{ 
                        x: isMobileSidebarOpen || window.innerWidth >= 768 ? 0 : '-100%',
                        width: window.innerWidth >= 768 ? '380px' : '100%'
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={`absolute md:relative z-10 h-full bg-card border-r border-border shadow-xl md:shadow-none`}
                >
                    <ConversationSidebar />
                </motion.div>

                {/* Chat Area */}
                <div className="flex-1 bg-background relative">
                    <ChatArea onMobileBack={() => setIsMobileSidebarOpen(true)} />
                </div>
            </div>
        </div>
    );
}
