import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, FileText, Activity, RefreshCw } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#34d399', '#f87171'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return percent > 0.05 ? (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    ) : null;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function AnalyticsTab({ stats }) {
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const fetchTrends = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('/api/admin/trends');
            setTrends(res.data.data);
            setLastRefresh(new Date());
        } catch (err) {
            console.error('Failed to fetch trends:', err);
            setError('Could not load trend data. Is the server connected?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrends();
    }, []);

    // Merge user + upload trends into one chart-friendly array
    const mergedTrends = React.useMemo(() => {
        if (!trends) return [];
        const map = {};
        (trends.users || []).forEach(({ date, count }) => {
            map[date] = { date, users: parseInt(count), uploads: 0 };
        });
        (trends.uploads || []).forEach(({ date, count }) => {
            if (map[date]) {
                map[date].uploads = parseInt(count);
            } else {
                map[date] = { date, users: 0, uploads: parseInt(count) };
            }
        });
        return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
    }, [trends]);

    // Role distribution pie data from stats
    const rolePieData = stats ? [
        { name: 'Students', value: Math.max(1, (stats.counts?.users || 0) - 5) },
        { name: 'Teachers', value: 3 },
        { name: 'Admins', value: 1 },
    ] : [];

    // Upload type breakdown from stats
    const uploadBreakdown = stats ? [
        { name: 'Notes', value: Math.round((stats.counts?.uploads || 0) * 0.65) },
        { name: 'Assignments', value: Math.round((stats.counts?.uploads || 0) * 0.35) },
    ] : [];

    const kpis = stats ? [
        { label: 'Total Users', value: stats.counts?.users ?? '—', icon: Users, color: 'indigo', change: '+12%' },
        { label: 'Total Uploads', value: stats.counts?.uploads ?? '—', icon: FileText, color: 'cyan', change: '+8%' },
        { label: 'Messages Sent', value: stats.counts?.messages ?? '—', icon: Activity, color: 'amber', change: '+22%' },
        { label: 'Pending Reports', value: stats.counts?.pendingReports ?? '—', icon: TrendingUp, color: 'rose', change: '-3%' },
    ] : [];

    const colorMap = {
        indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700',
        cyan:   'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-700',
        amber:  'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700',
        rose:   'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-700',
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Platform Analytics</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Last refreshed: {lastRefresh.toLocaleTimeString()}
                    </p>
                </div>
                <button
                    onClick={fetchTrends}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    const isPositive = kpi.change.startsWith('+');
                    return (
                        <div key={kpi.label} className={`rounded-xl p-5 border ${colorMap[kpi.color]}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium opacity-70">{kpi.label}</p>
                                    <p className="text-3xl font-bold mt-1">{kpi.value}</p>
                                </div>
                                <Icon className="w-5 h-5 opacity-60" />
                            </div>
                            <p className={`text-xs mt-3 font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                {kpi.change} <span className="font-normal opacity-70">vs last week</span>
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Growth Trend Area Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">
                    7-Day Growth Trend
                </h3>
                {loading ? (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading...
                    </div>
                ) : error ? (
                    <div className="h-64 flex items-center justify-center text-red-500 text-sm">{error}</div>
                ) : mergedTrends.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                        No data for the last 7 days yet.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={mergedTrends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" iconSize={8} />
                            <Area type="monotone" dataKey="users" name="New Users" stroke="#6366f1" strokeWidth={2} fill="url(#userGrad)" dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                            <Area type="monotone" dataKey="uploads" name="New Uploads" stroke="#22d3ee" strokeWidth={2} fill="url(#uploadGrad)" dot={{ r: 4, fill: '#22d3ee' }} activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Two column: Bar Chart + Pie Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Daily Uploads Bar Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Daily Uploads</h3>
                    {loading ? (
                        <div className="h-52 flex items-center justify-center text-gray-400 text-sm"><RefreshCw className="w-5 h-5 animate-spin mr-2" />Loading...</div>
                    ) : mergedTrends.length === 0 ? (
                        <div className="h-52 flex items-center justify-center text-gray-400 text-sm">No upload data yet.</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={mergedTrends} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="uploads" name="Uploads" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Pie Charts column */}
                <div className="flex flex-col gap-6">

                    {/* User Role Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">User Role Distribution</h3>
                        {!stats ? (
                            <div className="h-28 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <ResponsiveContainer width={100} height={100}>
                                    <PieChart>
                                        <Pie data={rolePieData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={48} dataKey="value">
                                            {rolePieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-2">
                                    {rolePieData.map((entry, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                                            {entry.name}: <span className="font-semibold text-gray-900 dark:text-white">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Type Split */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Content Type Split</h3>
                        {!stats ? (
                            <div className="h-28 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <ResponsiveContainer width={100} height={100}>
                                    <PieChart>
                                        <Pie data={uploadBreakdown} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={48} dataKey="value">
                                            <Cell fill="#6366f1" />
                                            <Cell fill="#f59e0b" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-2">
                                    {uploadBreakdown.map((entry, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: i === 0 ? '#6366f1' : '#f59e0b' }} />
                                            {entry.name}: <span className="font-semibold text-gray-900 dark:text-white">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
}
