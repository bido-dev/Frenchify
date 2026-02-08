import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Toast from '../components/Toast';
import { useUserStatus } from '../hooks/useUserStatus';

export default function PendingApproval() {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const hasRedirected = useRef(false); // Prevent multiple redirects

    // Listen for real-time status changes
    const { status: realtimeStatus } = useUserStatus(user?.uid);

    const isRejected = user?.status === 'rejected';

    // Auto-redirect when status changes to "active"
    useEffect(() => {
        if (realtimeStatus === 'active' && !hasRedirected.current) {
            hasRedirected.current = true; // Mark as redirecting
            setToast({ message: 'Your account has been approved! Redirecting...', type: 'success' });

            // Refresh user context and redirect
            refreshUser().then(() => {
                setTimeout(() => {
                    navigate('/teacher/dashboard', { replace: true });
                }, 1500);
            });
        }
    }, [realtimeStatus, navigate, refreshUser]);

    const handleReapply = async () => {
        setLoading(true);
        try {
            await api.post('/users/reapply');
            await refreshUser(); // Refresh user data to get updated status
            setToast({ message: 'Reapplication submitted successfully!', type: 'success' });
        } catch (error) {
            console.error('Error reapplying:', error);
            setToast({ message: 'Failed to submit reapplication', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Icon */}
                <div className={`w-20 h-20 ${isRejected ? 'bg-red-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <svg
                        className={`w-10 h-10 ${isRejected ? 'text-red-600' : 'text-yellow-600'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {isRejected ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        )}
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    {isRejected ? 'Application Rejected' : 'Account Pending Approval'}
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    {isRejected ? (
                        <>Unfortunately, <strong>{user?.name || user?.email}</strong>, your teacher application was not approved.</>
                    ) : (
                        <>Thank you for registering as a teacher, <strong>{user?.name || user?.email}</strong>!</>
                    )}
                </p>

                <div className={`${isRejected ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 mb-6`}>
                    <p className={`text-sm ${isRejected ? 'text-red-800' : 'text-blue-800'}`}>
                        {isRejected ? (
                            <>
                                If you believe this was a mistake or would like to reapply with additional information,
                                you can submit a new application below.
                            </>
                        ) : (
                            <>
                                Your account is currently under review by our administrators.
                                You will receive access to teacher features once your account is approved.
                            </>
                        )}
                    </p>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 ${isRejected ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
                    <span className={`w-2 h-2 ${isRejected ? 'bg-red-600' : 'bg-yellow-600 animate-pulse'} rounded-full`}></span>
                    Status: {isRejected ? 'Rejected' : 'Pending'}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    {isRejected && (
                        <button
                            onClick={handleReapply}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                'Reapply for Teacher Account'
                            )}
                        </button>
                    )}
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        Return to Home
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('userRole');
                            window.location.href = '/login';
                        }}
                        className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Help Text */}
                <p className="text-xs text-gray-500 mt-6">
                    {isRejected
                        ? 'For questions about your rejection, please contact support.'
                        : 'This usually takes 1-2 business days. If you have questions, please contact support.'}
                </p>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
