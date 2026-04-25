import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Trash2, ExternalLink, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ReportManagement() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending, resolved

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/admin/reports?status=${filter}`);
            setReports(res.data.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [filter]);

    const handleAction = async (reportId, action) => {
        if (!window.confirm(action === 'delete_content' ? 'Are you sure you want to delete this content? This cannot be undone.' : 'Dismiss this report?')) {
            return;
        }

        try {
            await axios.put(`/api/admin/reports/${reportId}/resolve`, { action });
            toast.success(action === 'delete_content' ? 'Content deleted' : 'Report dismissed');
            fetchReports();
        } catch (error) {
            toast.error('Failed to process action');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('resolved')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'resolved'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                    >
                        Resolved
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading reports...</div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <p className="text-gray-500">No {filter} reports found</p>
                    </div>
                ) : (
                    reports.map((report) => (
                        <div key={report.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                            Reported Content: <span className="text-blue-600">{report.content_title || 'Unknown Content'}</span>
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Type: {report.content_type || 'N/A'} • Reported by {report.reporter_name}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${report.reason === 'spam' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {report.reason}
                                    </span>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                                    "{report.description}"
                                </div>

                                <div className="text-xs text-gray-400">
                                    Reported on {new Date(report.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            {filter === 'pending' && (
                                <div className="flex flex-row md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6 min-w-[150px]">
                                    <button
                                        onClick={() => handleAction(report.id, 'dismiss')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Dismiss
                                    </button>
                                    <button
                                        onClick={() => handleAction(report.id, 'delete_content')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
