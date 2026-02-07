import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
    requiredRole?: 'student' | 'teacher' | 'admin';
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
    // TODO: Replace with actual auth check (Firebase, Context, etc.)
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole') || 'student'; // Default to student if not set
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        // Redirect to appropriate dashboard based on actual role
        if (userRole === 'admin') return <Navigate to="/admin" replace />;
        if (userRole === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
