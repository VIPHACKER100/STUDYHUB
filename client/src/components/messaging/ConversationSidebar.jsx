import React, { useState } from 'react';
import { Search, MessageSquarePlus, X } from 'lucide-react';
import { format } from 'date-fns';
import useMessageStore from '../../stores/messageStore';
import useAuthStore from '../../stores/authStore';
import NewConversationModal from './NewConversationModal';

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
        <div className="h-full flex flex-col">
            {/* Search Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 mb-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setIsNewChatModalOpen(true)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        title="New conversation"
                    >
                        <MessageSquarePlus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
                {filteredConversations.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <MessageSquarePlus className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {searchTerm ? 'No conversations found' : 'No conversations yet'}
                        </p>
                        <button
                            onClick={() => setIsNewChatModalOpen(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Start a conversation
                        </button>
                    </div>
                ) : (
                    <div>
                        {filteredConversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                onClick={() => selectConversation(conversation.id)}
                                className={`w-full p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left ${activeConversation === conversation.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600'
                                        : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                        {conversation.username?.[0]?.toUpperCase() || '?'}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                                {conversation.full_name || conversation.username}
                                            </h3>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                                                {formatTime(conversation.last_message_at)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                {conversation.last_message || 'No messages yet'}
                                            </p>
                                            {conversation.unread_count > 0 && (
                                                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full flex-shrink-0">
                                                    {conversation.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* New Conversation Modal */}
            {isNewChatModalOpen && (
                <NewConversationModal onClose={() => setIsNewChatModalOpen(false)} />
            )}
        </div>
    );
}



