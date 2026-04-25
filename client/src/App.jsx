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
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import HelpCenter from './pages/HelpCenter';
import Features from './pages/Features';
import Roadmap from './pages/Roadmap';
import NotFound from './pages/NotFound';
import Navbar from './components/layout/Navbar';
import PublicNavbar from './components/layout/PublicNavbar';

// Layout wrapper for dashboard pages
const Layout = ({ children }) => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
    </div>
);

// Layout wrapper for public info pages
const PublicLayout = ({ children }) => (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <PublicNavbar />
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
                    <Route path="/admin"
                        element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
                    />

                    {/* Public Info Routes */}
                    <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                    <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                    <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
                    <Route path="/terms" element={<PublicLayout><TermsOfService /></PublicLayout>} />
                    <Route path="/help" element={<PublicLayout><HelpCenter /></PublicLayout>} />
                    <Route path="/features" element={<PublicLayout><Features /></PublicLayout>} />
                    <Route path="/roadmap" element={<PublicLayout><Roadmap /></PublicLayout>} />

                    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;



