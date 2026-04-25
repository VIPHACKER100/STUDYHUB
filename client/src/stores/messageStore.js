import { create } from 'zustand';
import { messageAPI } from '../services/api';
import socketService from '../services/socket';

const useMessageStore = create((set, get) => ({
    conversations: [],
    activeConversation: null,
    messages: [],
    unreadCount: 0,
    loading: false,
    typingUsers: new Set(),

    // Fetch conversations
    fetchConversations: async () => {
        set({ loading: true });
        try {
            const response = await messageAPI.getConversations();
            set({ conversations: response.data.data.conversations, loading: false });
        } catch (error) {
            console.error('Fetch conversations error:', error);
            set({ loading: false });
        }
    },

    // Select conversation
    selectConversation: async (conversationId) => {
        set({ activeConversation: conversationId, messages: [], loading: true });

        try {
            const response = await messageAPI.getMessages(conversationId);
            set({ messages: response.data.data.messages, loading: false });

            // Join conversation via socket
            socketService.joinConversation(conversationId);
        } catch (error) {
            console.error('Fetch messages error:', error);
            set({ loading: false });
        }
    },

    // Send message
    sendMessage: async (conversationId, message, attachment = null) => {
        try {
            const res = await axios.post('/api/messages/send', {
                conversationId,
                message,
                ...attachment // spreads attachment_url and attachment_type
            });

            // Optimistic update not needed as socket will add it
            // but we can return success
            return { success: true };
        } catch (error) {
            console.error('Send message error:', error);
            return { success: false, error };
        }
    },

    // Add new message (from socket)
    addMessage: (message) => {
        set((state) => {
            // Only add if in active conversation
            if (state.activeConversation === message.conversation_id) {
                return { messages: [...state.messages, message] };
            }
            return state;
        });

        // Update conversation list
        get().fetchConversations();
    },

    // Update typing users
    setUserTyping: (userId, isTyping) => {
        set((state) => {
            const typingUsers = new Set(state.typingUsers);
            if (isTyping) {
                typingUsers.add(userId);
            } else {
                typingUsers.delete(userId);
            }
            return { typingUsers };
        });
    },

    // Fetch unread count
    fetchUnreadCount: async () => {
        try {
            const response = await messageAPI.getUnreadCount();
            set({ unreadCount: response.data.data.count });
        } catch (error) {
            console.error('Fetch unread count error:', error);
        }
    },
}));

export default useMessageStore;



