import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import RoomList from '../components/rooms/RoomList';
import CreateRoomModal from '../components/rooms/CreateRoomModal';
import RoomChat from '../components/rooms/RoomChat';
import { roomAPI } from '../services/api';
import socketService from '../services/socket';
import { toast } from 'react-hot-toast';

export default function AnonymousRooms() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const response = await roomAPI.getRooms();
            setRooms(response.data.data.rooms);
        } catch (error) {
            console.error('Fetch rooms error:', error);
            toast.error('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleRoomSelect = async (roomId) => {
        try {
            const response = await roomAPI.getRoom(roomId);
            setActiveRoom(response.data.data.room);
        } catch (error) {
            console.error('Get room error:', error);
            toast.error('Failed to load room');
        }
    };

    const handleCreateRoom = () => {
        setIsCreateModalOpen(true);
    };

    const handleRoomCreated = () => {
        setIsCreateModalOpen(false);
        fetchRooms();
        toast.success('Room created successfully!');
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Anonymous Rooms</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Join study groups anonymously
                    </p>
                </div>
                <button
                    onClick={handleCreateRoom}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Room</span>
                </button>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Room List Sidebar */}
                <div className={`${activeRoom ? 'hidden lg:block' : 'block'
                    } w-full lg:w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto scrollbar-thin`}>
                    <RoomList
                        rooms={rooms}
                        activeRoom={activeRoom}
                        onSelectRoom={handleRoomSelect}
                        loading={loading}
                    />
                </div>

                {/* Chat Area */}
                <div className={`${!activeRoom ? 'hidden lg:block' : 'block'
                    } flex-1 bg-gray-50 dark:bg-gray-900`}>
                    {activeRoom ? (
                        <RoomChat
                            room={activeRoom}
                            onBack={() => setActiveRoom(null)}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center p-8">
                            <div className="text-center max-w-md">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
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
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No Room Selected
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Select a room from the sidebar to start chatting anonymously
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Room Modal */}
            {isCreateModalOpen && (
                <CreateRoomModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreated={handleRoomCreated}
                />
            )}
        </div>
    );
}
