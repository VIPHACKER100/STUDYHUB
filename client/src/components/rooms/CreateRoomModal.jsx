import React, { useState } from 'react';
import { X } from 'lucide-react';
import { roomAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

export default function CreateRoomModal({ onClose, onCreated }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        subject: '',
        roomType: 'study_group',
        isPublic: true,
        isTemporary: false,
        maxParticipants: 50,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await roomAPI.createRoom(formData);
            toast.success('Room created successfully!');
            onCreated();
        } catch (error) {
            console.error('Create room error:', error);
            toast.error(error.response?.data?.message || 'Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Create Anonymous Room
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Room Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Room Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Math Study Group"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
                            placeholder="Desc ribe what this room is about..."
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Mathematics, Physics, etc."
                        />
                    </div>

                    {/* Room Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Room Type *
                        </label>
                        <select
                            name="roomType"
                            value={formData.roomType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="study_group">Study Group</option>
                            <option value="assignment_help">Assignment Help</option>
                            <option value="exam_prep">Exam Preparation</option>
                            <option value="general">General Chat</option>
                        </select>
                    </div>

                    {/* Max Participants */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Max Participants
                        </label>
                        <input
                            type="number"
                            name="maxParticipants"
                            value={formData.maxParticipants}
                            onChange={handleChange}
                            min="2"
                            max="100"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isPublic"
                                checked={formData.isPublic}
                                onChange={handleChange}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Public Room</strong> - Anyone can join
                            </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isTemporary"
                                checked={formData.isTemporary}
                                onChange={handleChange}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Temporary Room</strong> - Auto-delete after inactivity
                            </span>
                        </label>
                    </div>

                    {/* Anonymous Notice */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <p className="text-sm text-purple-900 dark:text-purple-300">
                            🎭 <strong>Anonymous Chat:</strong> Participants will have random names like "Purple Panda 42" to protect their identity.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
