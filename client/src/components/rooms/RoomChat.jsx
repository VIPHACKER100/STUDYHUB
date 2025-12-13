import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Users, Send, LogOut } from 'lucide-react';
import { roomAPI } from '../../services/api';
import socketService from '../../services/socket';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function RoomChat({ room, onBack }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [session, setSession] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        joinRoom();
        loadMessages();

        // Setup Socket.io listeners
        socketService.onRoomJoined((data) => {
            setSession(data.session);
            toast.success(`Joined as ${data.anonymousId}`);
        });

        socketService.onRoomNewMessage((message) => {
            setMessages(prev => [...prev, message]);
        });

        socketService.onUserJoinedRoom(({ anonymousId }) => {
            toast(`${anonymousId} joined the room`, { icon: '👋' });
        });

        socketService.onUserLeftRoom(({ anonymousId }) => {
            if (anonymousId) {
                toast(`${anonymousId} left the room`, { icon: '👋' });
            }
        });

        return () => {
            leaveRoom();
        };
    }, [room.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const joinRoom = async () => {
        try {
            const response = await roomAPI.joinRoom(room.id);
            setSession(response.data.data.session);
            socketService.joinRoom(room.id);
        } catch (error) {
            console.error('Join room error:', error);
            toast.error('Failed to join room');
        }
    };

    const loadMessages = async () => {
        try {
            const response = await roomAPI.getRoomMessages(room.id);
            setMessages(response.data.data.messages);
        } catch (error) {
            console.error('Load messages error:', error);
        }
    };

    const leaveRoom = async () => {
        try {
            await roomAPI.leaveRoom(room.id);
            socketService.leaveRoom(room.id);
        } catch (error) {
            console.error('Leave room error:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !session || sending) return;

        setSending(true);
        try {
            socketService.sendRoomMessage({
                roomId: room.id,
                message: newMessage.trim(),
            });
            setNewMessage('');
        } catch (error) {
            console.error('Send message error:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleLeaveRoom = async () => {
        await leaveRoom();
        onBack();
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLeaveRoom}
                        className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex-1">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            {room.name}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{room.active_participants || 0} participants</span>
                            {session && (
                                <>
                                    <span>•</span>
                                    <span className="text-purple-600 dark:text-purple-400">
                                        You: {session.anonymous_id}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleLeaveRoom}
                        className="hidden lg:flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Leave
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin bg-gray-50 dark:bg-gray-900 p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">No messages yet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            Be the first to say hello!
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start gap-3 ${message.anonymous_id === session?.anonymous_id ? 'flex-row-reverse' : ''
                                }`}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                {message.anonymous_id.split(' ')[0][0]}
                            </div>
                            <div className={`max-w-[70%] ${message.anonymous_id === session?.anonymous_id ? 'items-end' : 'items-start'
                                }`}>
                                <div className={`px-4 py-2 rounded-2xl ${message.anonymous_id === session?.anonymous_id
                                        ? 'bg-purple-600 text-white rounded-br-sm'
                                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm shadow-sm'
                                    }`}>
                                    {message.anonymous_id !== session?.anonymous_id && (
                                        <p className="text-xs font-semibold mb-1 opacity-75">
                                            {message.anonymous_id}
                                        </p>
                                    )}
                                    <p className="text-sm whitespace-pre-wrap break-words">
                                        {message.message}
                                    </p>
                                    <p className={`text-xs mt-1 ${message.anonymous_id === session?.anonymous_id
                                            ? 'text-purple-100'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {format(new Date(message.created_at), 'HH:mm')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={session ? "Type a message..." : "Joining room..."}
                        disabled={!session || sending}
                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || !session || sending}
                        className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
