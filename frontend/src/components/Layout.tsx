import React, { useState } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { Button } from './Button';
import { User, BookOpen, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();

    const isTeacher = user?.role === 'teacher';
    const isFree = user?.tier === 'free';

    const getNavItems = () => {
        if (isTeacher) {
            return [
                { path: '/teacher/dashboard', label: 'Courses', icon: <BookOpen size={20} /> },
                { path: '/teacher/questions', label: 'My Questions', icon: <MessageCircle size={20} /> },
            ];
        }
        return [
            { path: '/dashboard', label: 'Catalog', icon: <BookOpen size={20} /> },
            { path: '/my-questions', label: 'My Questions', icon: <MessageCircle size={20} /> },
        ];
    };

    const navItems = getNavItems();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar (sliding from left) */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="h-16 flex items-center px-4 md:px-6 border-b border-gray-200 justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${isTeacher ? 'from-indigo-600 to-indigo-500' : 'from-blue-600 to-blue-500'} flex items-center justify-center text-white font-bold text-xl`}>
                            {isTeacher ? 'T' : 'F'}
                        </div>
                        <span className="font-bold text-xl text-gray-900">Frenchify</span>
                    </div>
                    <button
                        className="text-gray-500 hover:text-gray-700 p-1"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => {
                                const active = isActive || (item.path === '/teacher/dashboard' && location.pathname.startsWith('/teacher/course'));
                                return `
                                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                ${active
                                        ? isTeacher ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }
                                `;
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <NavLink
                            to="/profile"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                ${isActive
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                        >
                            <User size={20} />
                            Profile
                        </NavLink>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Navbar */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center gap-4">
                                {/* Hamburger Menu in France colors */}
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="focus:outline-none flex-shrink-0 transition-transform hover:scale-105"
                                    aria-label="Open Menu"
                                >
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
                                    >
                                        {/* Blue top line */}
                                        <line x1="4" x2="20" y1="6" y2="6" stroke="#0055A4" />
                                        {/* White middle line */}
                                        <line x1="4" x2="20" y1="12" y2="12" stroke="#FFFFFF" />
                                        {/* Red bottom line */}
                                        <line x1="4" x2="20" y1="18" y2="18" stroke="#EF4135" />
                                    </svg>
                                </button>

                                <Link to={isTeacher ? "/teacher/dashboard" : "/dashboard"} className="flex-shrink-0 flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${isTeacher ? 'from-indigo-600 to-indigo-500' : 'from-blue-600 to-blue-500'} flex items-center justify-center text-white font-bold text-xl`}>
                                        {isTeacher ? 'T' : 'S'}
                                    </div>
                                    <span className="font-bold text-xl tracking-tight text-gray-900">
                                        Frenchify {isTeacher}
                                    </span>
                                </Link>
                            </div>

                            <div className="flex items-center gap-4">
                                {isFree && !isTeacher && (
                                    <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 font-medium border-transparent shadow-sm">
                                        Upgrade to Pro
                                    </Button>
                                )}

                                <Link to="/profile">
                                    <div className={`h-8 w-8 rounded-full ${isTeacher ? 'bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200 hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500 transition-all cursor-pointer' : 'bg-gray-200 flex items-center justify-center text-gray-500 border border-gray-300 hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all cursor-pointer'}`}>
                                        <User size={18} />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex flex-col bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
