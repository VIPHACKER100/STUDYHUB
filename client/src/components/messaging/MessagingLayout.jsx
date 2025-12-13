import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ConversationSidebar from './ConversationSidebar';
import ChatArea from './ChatArea';
import useAuthStore from '../../stores/authStore';
import useMessageStore from '../../stores/messageStore';
import socketService from '../../services/socket';

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
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user?.username}
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Hidden on mobile when chat is open */}
                <div
                    className={`${isMobileSidebarOpen ? 'block' : 'hidden'
                        } md:block w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`}
                >
                    <ConversationSidebar />
                </div>

                {/* Chat Area - Hidden on mobile when sidebar is open */}
                <div
                    className={`${!isMobileSidebarOpen ? 'block' : 'hidden'
                        } md:block flex-1 bg-gray-50 dark:bg-gray-900`}
                >
                    <ChatArea onMobileBack={() => setIsMobileSidebarOpen(true)} />
                </div>
            </div>
        </div>
    );
}
