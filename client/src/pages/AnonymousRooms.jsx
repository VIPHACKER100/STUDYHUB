import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Users, Sparkles, Ghost } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import RoomList from '../components/rooms/RoomList';
import CreateRoomModal from '../components/rooms/CreateRoomModal';
import RoomChat from '../components/rooms/RoomChat';
import { roomAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

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
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate('/dashboard')}
                        className="rounded-full w-10 h-10 p-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-display text-foreground tracking-tight">Anonymous Rooms</h1>
                            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 hidden sm:flex">
                                <Ghost className="w-3.5 h-3.5" />
                                PRIVATE
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            Real-time cryptonym collaboration
                        </p>
                    </div>
                </div>
                
                <Button 
                    onClick={handleCreateRoom}
                    className="rounded-full shadow-lg shadow-accent/20"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Room
                </Button>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Room List Sidebar */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`${activeRoom ? 'hidden lg:block' : 'block'
                    } w-full lg:w-[400px] border-r border-border bg-background overflow-y-auto custom-scrollbar`}
                >
                    <div className="p-6">
                        <RoomList
                            rooms={rooms}
                            activeRoom={activeRoom}
                            onSelectRoom={handleRoomSelect}
                            loading={loading}
                        />
                    </div>
                </motion.div>

                {/* Chat Area */}
                <div className={`${!activeRoom ? 'hidden lg:block' : 'block'
                    } flex-1 bg-muted/30 relative`}>
                    
                    <AnimatePresence mode="wait">
                        {activeRoom ? (
                            <motion.div 
                                key={activeRoom.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full"
                            >
                                <RoomChat
                                    room={activeRoom}
                                    onBack={() => setActiveRoom(null)}
                                />
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex items-center justify-center p-8"
                            >
                                <div className="text-center max-w-sm">
                                    <div className="w-24 h-24 mx-auto mb-8 rounded-[2rem] bg-accent/10 flex items-center justify-center relative">
                                        <div className="absolute inset-0 bg-accent/20 rounded-[2rem] blur-xl opacity-50" />
                                        <Users className="w-12 h-12 text-accent relative z-10" />
                                    </div>
                                    <h3 className="text-2xl font-display text-foreground mb-4">
                                        No Selection Made
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed mb-10">
                                        Select an anonymous study room from the sidebar to begin collaborating without social friction.
                                    </p>
                                    <div className="flex justify-center gap-3">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent/20" />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Create Room Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <CreateRoomModal
                        onClose={() => setIsCreateModalOpen(false)}
                        onCreated={handleRoomCreated}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}




