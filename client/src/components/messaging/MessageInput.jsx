import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, X, File } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useMessageStore from '../../stores/messageStore';
import socketService from '../../services/socket';
import axios from 'axios';

export default function MessageInput() {
    const { activeConversation, sendMessage } = useMessageStore();
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const handleTyping = () => {
        if (activeConversation) {
            socketService.startTyping(activeConversation);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socketService.stopTyping(activeConversation);
            }, 3000);
        }
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
        handleTyping();
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            toast.error('File too large (max 50MB)');
            return;
        }

        setAttachment(file);
        // Reset input so same file can be selected again if needed (after removal)
        e.target.value = null;
    };

    const removeAttachment = () => {
        setAttachment(null);
    };

    const handleSend = async () => {
        if ((!message.trim() && !attachment) || !activeConversation || sending) return;

        setSending(true);
        try {
            socketService.stopTyping(activeConversation);

            let attachmentData = null;

            // Upload attachment if exists
            if (attachment) {
                const formData = new FormData();
                formData.append('file', attachment);

                try {
                    const uploadRes = await axios.post('/api/messages/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (uploadRes.data.success) {
                        attachmentData = {
                            attachmentUrl: uploadRes.data.data.url,
                            attachmentType: uploadRes.data.data.type
                        };
                    }
                } catch (uploadErr) {
                    console.error('Upload failed', uploadErr);
                    toast.error('Failed to upload file');
                    setSending(false);
                    return;
                }
            }

            const result = await sendMessage(activeConversation, message.trim(), attachmentData);

            if (result.success) {
                setMessage('');
                setAttachment(null);
                if (textareaRef.current) textareaRef.current.style.height = 'auto';
            } else {
                toast.error('Failed to send message');
            }
        } catch (error) {
            console.error('Send error:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            {/* Attachment Preview */}
            {attachment && (
                <div className="mb-2 flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg max-w-fit">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <File className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                            {attachment.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(attachment.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                    <button
                        onClick={removeAttachment}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            )}

            <div className="flex items-end gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                    title="Attach file"
                >
                    <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-2 pr-10 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32 scrollbar-thin"
                        style={{ minHeight: '42px' }}
                    />
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        title="Add emoji"
                    >
                        <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <button
                    onClick={handleSend}
                    disabled={(!message.trim() && !attachment) || sending}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    title="Send message"
                >
                    {sending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Press Enter to send, Shift+Enter for new line
            </p>
        </div>
    );
}




