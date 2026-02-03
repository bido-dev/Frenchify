import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button';
import { User, BookOpen } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    userTier?: 'free' | 'paid'; // Mock user tier prop
}

export const Layout: React.FC<LayoutProps> = ({ children, userTier = 'free' }) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                                    F
                                </div>
                                <span className="font-bold text-xl tracking-tight text-gray-900">Frenchify</span>
                            </Link>
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                                <Link
                                    to="/dashboard"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/dashboard') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Catalog
                                </Link>
                                {/* Visual placeholders for filters if they were pages, but they are filters on dashboard */}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {userTier === 'free' && (
                                <Button variant="primary" size="sm" className="bg-amber-500 hover:bg-amber-600 border-transparent">
                                    Upgrade to Pro
                                </Button>
                            )}
                            <div className="flex-shrink-0">
                                <Link to="/profile">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border border-gray-300 hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all cursor-pointer">
                                        <User size={18} />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};
