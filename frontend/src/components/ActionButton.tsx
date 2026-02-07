import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

type ActionVariant = 'approve' | 'reject' | 'delete' | 'neutral' | 'primary';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ActionVariant;
    loading?: boolean;
    size?: 'sm' | 'md';
    icon?: React.ReactNode;
}

export default function ActionButton({
    variant = 'neutral',
    loading = false,
    size = 'sm',
    icon,
    children,
    className = '',
    disabled,
    ...props
}: ActionButtonProps) {

    const getVariantClasses = () => {
        switch (variant) {
            case 'approve':
                return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200';
            case 'reject':
                return 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200';
            case 'delete':
                return 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200';
            case 'primary':
                return 'bg-blue-600 text-white hover:bg-blue-700 border border-transparent shadow-sm';
            case 'neutral':
            default:
                return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'md':
                return 'px-4 py-2 text-sm';
            case 'sm':
            default:
                return 'px-3 py-1 text-xs';
        }
    };

    return (
        <button
            className={`
        inline-flex items-center justify-center gap-1.5 
        font-medium rounded-md transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? (
                <LoadingSpinner size="sm" color={variant === 'primary' ? 'white' : 'currentColor'} />
            ) : icon ? (
                <span className="shrink-0">{icon}</span>
            ) : null}

            {children}
        </button>
    );
}
