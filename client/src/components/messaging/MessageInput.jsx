import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, X, File, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useMessageStore from '../../stores/messageStore';
import socketService from '../../services/socket';
import axios from 'axios';
import { Button } from '../ui/Button';

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

        if (file.size > 50 * 1024 * 1024) { 
            toast.error('File too large (max 50MB)');
            return;
        }

        setAttachment(file);
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
        <div className="bg-card border border-border shadow-2xl rounded-[2rem] p-4 relative">
            <AnimatePresence>
                {attachment && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mb-4 flex items-center gap-4 p-3 bg-muted/50 rounded-2xl border border-border/50 max-w-sm"
                    >
                        <div className="p-3 bg-accent/10 rounded-xl">
                            <File className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">
                                {attachment.name}
                            </p>
                            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                {(attachment.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            onClick={removeAttachment}
                            className="p-1.5 hover:bg-muted-foreground/10 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-end gap-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />
                
                <div className="flex items-center gap-1 mb-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-muted-foreground hover:text-accent rounded-xl hover:bg-accent/5"
                    >
                        <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-accent rounded-xl hover:bg-accent/5"
                    >
                        <Smile className="w-5 h-5" />
                    </Button>
                </div>

                <div className="flex-1 bg-muted/30 rounded-2xl px-4 py-2 border border-transparent focus-within:border-accent/30 transition-all">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Share your thoughts..."
                        rows={1}
                        className="w-full bg-transparent text-foreground text-sm focus:outline-none resize-none max-h-32 scrollbar-thin py-1"
                        style={{ minHeight: '32px' }}
                    />
                </div>

                <Button
                    onClick={handleSend}
                    disabled={(!message.trim() && !attachment) || sending}
                    className="h-11 w-11 rounded-2xl flex-shrink-0 shadow-lg shadow-accent/20 transition-all active:scale-95"
                >
                    {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </Button>
            </div>
            
            <div className="absolute -bottom-6 left-6 right-6 flex justify-between px-2">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    Enter to send • Shift+Enter for new line
                </p>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest hidden md:block">
                    50MB Max Upload
                </p>
            </div>
        </div>
    );
}
