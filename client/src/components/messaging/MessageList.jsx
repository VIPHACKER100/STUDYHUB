import React from 'react';
import { format } from 'date-fns';
import useMessageStore from '../../stores/messageStore';
import useAuthStore from '../../stores/authStore';
import MessageBubble from './MessageBubble';

export default function MessageList() {
    const { messages, loading, typingUsers } = useMessageStore();
    const { user } = useAuthStore();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        No messages yet
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Send a message to start the conversation
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
        <div className="p-4 space-y-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                    {/* Date Separator */}
                    <div className="flex items-center justify-center my-4">
                        <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
                            {formatDateHeader(date)}
                        </div>
                    </div>

                    {/* Messages for this date */}
                    <div className="space-y-2">
                        {dateMessages.map((message, index) => {
                            const isOwnMessage = message.sender_id === user?.id;
                            const showAvatar =
                                !isOwnMessage &&
                                (index === dateMessages.length - 1 ||
                                    dateMessages[index + 1]?.sender_id !== message.sender_id);

                            return (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isOwnMessage={isOwnMessage}
                                    showAvatar={showAvatar}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Typing Indicator */}
            {typingUsers.size > 0 && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <div className="flex gap-1">
                        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></span>
                    </div>
                    <span>typing...</span>
                </div>
            )}
        </div>
    );
}



