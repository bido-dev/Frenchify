import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    className = '',
    error,
    id,
    ...props
}) => {
    const inputId = id || props.name; // Fallback to name if ID not provided

    return (
        <div className="w-full">
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={inputId}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all ${error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    } ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
