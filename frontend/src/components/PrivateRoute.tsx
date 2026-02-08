import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

interface PrivateRouteProps {
    children: React.ReactNode;
    requiredRole?: 'student' | 'teacher' | 'admin';
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading..." />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if teacher is pending approval
    if (user.role === 'teacher' && user.status === 'pending') {
        // Allow access to pending approval page only
        if (location.pathname === '/teacher/pending') {
            return <>{children}</>;
        }
        return <Navigate to="/teacher/pending" replace />;
    }

    // Check if teacher was rejected - allow reapplication
    if (user.role === 'teacher' && user.status === 'rejected') {
        // Allow access to reapply page
        if (location.pathname === '/teacher/pending') {
            return <>{children}</>;
        }
        return <Navigate to="/teacher/pending" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on actual role
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
