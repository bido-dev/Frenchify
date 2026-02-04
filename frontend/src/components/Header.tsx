import React from 'react';

interface HeaderProps {
    userName?: string;
    streak?: number;
}

export const Header: React.FC<HeaderProps> = ({ userName = 'Student', streak = 0 }) => {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Bienvenue, {userName}!</h1>
                <p className="text-blue-100 max-w-xl">
                    Ready to continue your French journey today?{streak > 0 && ` You have a ${streak}-day streak!`}
                </p>
            </div>
            {/* Decorative circle */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
        </div>
    );
};