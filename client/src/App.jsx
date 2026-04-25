import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './stores/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import AnonymousRooms from './pages/AnonymousRooms';
import Browse from './pages/Browse';
import MyProfile from './pages/MyProfile';
import AdminDashboard from './pages/AdminDashboard';
import VerifyEmail from './pages/VerifyEmail';
import PublicProfile from './pages/PublicProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Leaderboard from './pages/Leaderboard';
import Navbar from './components/layout/Navbar';

// Layout wrapper — renders Navbar above all protected pages
const Layout = ({ children }) => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
    </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuthStore();

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }

    return <Layout>{children}</Layout>;
};

function App() {
    const { isAuthenticated, initialize, user, loading } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (loading) {
        return <div>Loading application...</div>;
    }

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Toaster position="top-right" />

                <Routes>
                    <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route
                        path="/u/:username"
                        element={<ProtectedRoute><PublicProfile /></ProtectedRoute>}
                    />

                    <Route
                        path="/dashboard"
                        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                    />
                    <Route
                        path="/messages"
                        element={<ProtectedRoute><Messages /></ProtectedRoute>}
                    />
                    <Route
                        path="/rooms"
                        element={<ProtectedRoute><AnonymousRooms /></ProtectedRoute>}
                    />
                    <Route
                        path="/browse"
                        element={<ProtectedRoute><Browse /></ProtectedRoute>}
                    />
                    <Route
                        path="/profile"
                        element={<ProtectedRoute><MyProfile /></ProtectedRoute>}
                    />
                    <Route
                        path="/leaderboard"
                        element={<ProtectedRoute><Leaderboard /></ProtectedRoute>}
                    />

                    {/* Admin Route */}
                    <Route
                        path="/admin"
                        element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
                    />

                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
