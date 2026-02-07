import React from 'react';

type BadgeVariant = 'free' | 'pro' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
    variant: BadgeVariant;
    text?: string;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, text, className = '' }) => {
    const styles = {
        free: "bg-emerald-500 text-white",
        pro: "bg-amber-500 text-white",
        neutral: "bg-gray-200 text-gray-700",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        danger: "bg-red-100 text-red-800",
        info: "bg-blue-100 text-blue-800"
    };

    const displayText = text || (variant === 'free' ? 'FREE' : variant === 'pro' ? 'PRO' : '');

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${styles[variant]} ${className}`}>
            {displayText}
        </span>
    );
};
