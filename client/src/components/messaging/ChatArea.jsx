import React, { useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import useMessageStore from '../../stores/messageStore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

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
            <div className="h-full flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Conversation Selected
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Select a conversation from the sidebar or start a new one to begin messaging
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
                {/* Mobile back button */}
                <button
                    onClick={onMobileBack}
                    className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {currentConversation?.username?.[0]?.toUpperCase() || '?'}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-900 dark:text-white truncate">
                        {currentConversation?.full_name || currentConversation?.username}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        @{currentConversation?.username}
                    </p>
                </div>

                {/* More Options */}
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin bg-gray-50 dark:bg-gray-900">
                <MessageList />
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <MessageInput />
        </div>
    );
}



