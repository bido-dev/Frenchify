import React from 'react';

type BadgeVariant = 'free' | 'pro' | 'neutral';

interface BadgeProps {
    variant: BadgeVariant;
    text?: string;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, text, className = '' }) => {
    const styles = {
        free: "bg-emerald-500 text-white",
        pro: "bg-amber-500 text-white",
        neutral: "bg-gray-200 text-gray-700"
    };

    const displayText = text || (variant === 'free' ? 'FREE' : variant === 'pro' ? 'PRO' : '');

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${styles[variant]} ${className}`}>
            {displayText}
        </span>
    );
};
