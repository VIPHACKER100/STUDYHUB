import React, { useState } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { authAPI, messageAPI } from '../../services/api';
import useMessageStore from '../../stores/messageStore';
import { toast } from 'react-hot-toast';

export default function NewConversationModal({ onClose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { selectConversation, fetchConversations } = useMessageStore();

    const handleSearch = async (query) => {
        setSearchQuery(query);

        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.searchUsers(query);
            setSearchResults(response.data.data.users);
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to search users');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = async (userId) => {
        try {
            setLoading(true);
            const response = await messageAPI.getOrCreateConversation(userId);
            const conversation = response.data.data.conversation;

            // Refresh list
            await fetchConversations();

            // Select the conversation
            await selectConversation(conversation.id);

            onClose();
            toast.success('Conversation started');
        } catch (error) {
            console.error('Error starting conversation:', error);
            toast.error(error.response?.data?.message || 'Failed to start conversation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[600px] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        New Conversation
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by name or username..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            autoFocus
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-600 dark:text-gray-400">
                                {searchQuery.length < 2
                                    ? 'Type at least 2 characters to search'
                                    : 'No users found'}
                            </p>
                        </div>
                    ) : (
                        <div>
                            {searchResults.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleSelectUser(user.id)}
                                    className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-center gap-3 text-left border-b border-gray-200 dark:border-gray-700 last:border-0"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {user.full_name || user.username}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            @{user.username} • {user.role}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}



