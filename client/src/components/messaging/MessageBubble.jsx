import React, { useState } from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function MessageBubble({ message, isOwnMessage, showAvatar }) {
    const [showOptions, setShowOptions] = useState(false);

    const formatTime = (timestamp) => {
        return format(new Date(timestamp), 'HH:mm');
    };

    return (
        <div
            className={`flex items-end gap-2 message-bubble ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                }`}
        >
            {/* Avatar (for received messages) */}
            {!isOwnMessage && (
                <div className="w-8 h-8 flex-shrink-0">
                    {showAvatar && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                            {message.username?.[0]?.toUpperCase() || '?'}
                        </div>
                    )}
                </div>
            )}

            {/* Message Content */}
            <div
                className={`max-w-[70%] relative group ${isOwnMessage ? 'items-end' : 'items-start'
                    }`}
            >
                <div
                    className={`px-4 py-2 rounded-2xl ${isOwnMessage
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm shadow-sm'
                        }`}
                >
                    {/* Message Text */}
                    <p className="text-sm whitespace-pre-wrap break-words">
                        {message.is_deleted ? (
                            <em className="text-gray-400">This message was deleted</em>
                        ) : (
                            message.message
                        )}
                    </p>

                    {/* Attachment (if any) */}
                    {message.attachment_url && !message.is_deleted && (
                        <div className="mt-2">
                            {message.attachment_type?.startsWith('image/') ? (
                                <img
                                    src={message.attachment_url}
                                    alt="Attachment"
                                    className="rounded-lg max-w-full h-auto"
                                />
                            ) : (
                                <a
                                    href={message.attachment_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm underline"
                                >
                                    📎 {message.attachment_type}
                                </a>
                            )}
                        </div>
                    )}

                    {/* Time and Status */}
                    <div
                        className={`flex items-center gap-1 mt-1 text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                            }`}
                    >
                        <span>{formatTime(message.created_at)}</span>
                        {message.is_edited && <span>• edited</span>}
                        {isOwnMessage && (
                            <>
                                {message.is_read ? (
                                    <CheckCheck className="w-3.5 h-3.5" />
                                ) : (
                                    <Check className="w-3.5 h-3.5" />
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Options Menu (own messages only) */}
                {isOwnMessage && !message.is_deleted && (
                    <div className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative">
                            <button
                                onClick={() => setShowOptions(!showOptions)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>

                            {showOptions && (
                                <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 w-32 z-10">
                                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                        <Edit2 className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600">
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
