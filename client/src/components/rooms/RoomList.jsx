import React from 'react';
import { Users, Hash, Clock, UserPlus } from 'lucide-react';

export default function RoomList({ rooms, activeRoom, onSelectRoom, loading }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (rooms.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">No active rooms</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                    Be the first to create a study room!
                </p>
            </div>
        );
    }

    // Group rooms by type
    const roomsByType = rooms.reduce((acc, room) => {
        const type = room.room_type || 'general';
        if (!acc[type]) acc[type] = [];
        acc[type].push(room);
        return acc;
    }, {});

    const typeLabels = {
        study_group: 'Study Groups',
        assignment_help: 'Assignment Help',
        exam_prep: 'Exam Preparation',
        general: 'General Chat',
    };

    const typeColors = {
        study_group: 'bg-blue-500',
        assignment_help: 'bg-green-500',
        exam_prep: 'bg-orange-500',
        general: 'bg-purple-500',
    };

    return (
        <div className="p-4 space-y-6">
            {Object.entries(roomsByType).map(([type, typeRooms]) => (
                <div key={type}>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                        {typeLabels[type] || type}
                    </h3>
                    <div className="space-y-2">
                        {typeRooms.map((room) => (
                            <button
                                key={room.id}
                                onClick={() => onSelectRoom(room.id)}
                                className={`w-full p-4 rounded-lg border transition-all text-left ${activeRoom?.id === room.id
                                        ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 shadow-md'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${typeColors[type]} flex items-center justify-center flex-shrink-0`}>
                                        <Hash className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {room.name}
                                        </h4>
                                        {room.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                {room.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {room.active_participants || 0}/{room.max_participants}
                                            </span>
                                            {room.subject && (
                                                <span className="flex items-center gap-1">
                                                    📚 {room.subject}
                                                </span>
                                            )}
                                            {room.is_temporary && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Temporary
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}



