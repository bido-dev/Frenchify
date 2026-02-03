import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, BookOpen, MessageCircle } from 'lucide-react';

interface TeacherLayoutProps {
    children: React.ReactNode;
}

export const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/teacher/dashboard" className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                                    T
                                </div>
                                <span className="font-bold text-xl tracking-tight text-gray-900">Frenchify <span className="text-gray-500 font-normal">Teacher</span></span>
                            </Link>
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                                <Link
                                    to="/teacher/dashboard"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/teacher/dashboard') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Courses
                                </Link>
                                <Link
                                    to="/teacher/questions"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/teacher/questions') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    My Questions
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                                <Link to="/profile">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200 hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500 transition-all cursor-pointer">
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
