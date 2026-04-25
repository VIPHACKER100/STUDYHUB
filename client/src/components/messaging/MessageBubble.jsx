import React, { useState } from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck, MoreVertical, Edit2, Trash2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MessageBubble({ message, isOwnMessage, showAvatar }) {
    const [showOptions, setShowOptions] = useState(false);

    const formatTime = (timestamp) => {
        return format(new Date(timestamp), 'HH:mm');
    };

    return (
        <div
            className={`flex items-end gap-3 message-bubble ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar (for received messages) */}
            {!isOwnMessage && (
                <div className="w-8 h-8 flex-shrink-0 mb-1">
                    {showAvatar ? (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                            {message.username?.[0]?.toUpperCase() || '?'}
                        </div>
                    ) : (
                        <div className="w-8 h-8" />
                    )}
                </div>
            )}

            {/* Message Content */}
            <div
                className={`max-w-[75%] relative group flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
            >
                <div
                    className={`px-5 py-3 rounded-2xl shadow-sm ${isOwnMessage
                            ? 'bg-foreground text-white rounded-br-none'
                            : 'bg-card text-foreground rounded-bl-none border border-border'
                        }`}
                >
                    {/* Message Text */}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.is_deleted ? (
                            <em className="opacity-50">This message was deleted</em>
                        ) : (
                            message.message
                        )}
                    </div>

                    {/* Attachment (if any) */}
                    {message.attachment_url && !message.is_deleted && (
                        <div className="mt-3">
                            {message.attachment_type?.startsWith('image/') ? (
                                <motion.img
                                    whileHover={{ scale: 1.02 }}
                                    src={message.attachment_url}
                                    alt="Attachment"
                                    className="rounded-xl max-w-full h-auto cursor-pointer shadow-md"
                                />
                            ) : (
                                <a
                                    href={message.attachment_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                        isOwnMessage 
                                            ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                                            : 'bg-muted/50 border-border hover:bg-muted'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg ${isOwnMessage ? 'bg-white/20' : 'bg-accent/10'}`}>
                                        <FileText className={`w-4 h-4 ${isOwnMessage ? 'text-white' : 'text-accent'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold truncate">FILE ATTACHMENT</p>
                                        <p className="text-[9px] font-mono opacity-60 uppercase tracking-tighter">View Resource</p>
                                    </div>
                                </a>
                            )}
                        </div>
                    )}

                    {/* Time and Status */}
                    <div
                        className={`flex items-center gap-2 mt-2 text-[9px] font-mono font-bold uppercase tracking-widest ${isOwnMessage ? 'text-white/50' : 'text-muted-foreground/60'
                            }`}
                    >
                        <span>{formatTime(message.created_at)}</span>
                        {message.is_edited && <span>• EDITED</span>}
                        {isOwnMessage && (
                            <span className="flex items-center">
                                {message.is_read ? (
                                    <CheckCheck className="w-3 h-3 text-accent" />
                                ) : (
                                    <Check className="w-3 h-3" />
                                )}
                            </span>
                        )}
                    </div>
                </div>

                {/* Options Menu (own messages only) */}
                {isOwnMessage && !message.is_deleted && (
                    <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2">
                            <button className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors">EDIT</button>
                            <span className="text-muted-foreground/30 text-[10px]">•</span>
                            <button className="text-[10px] font-mono text-red-400 hover:text-red-500 transition-colors">DELETE</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
