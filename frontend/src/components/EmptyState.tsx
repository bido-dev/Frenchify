import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Icon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-4">{description}</p>
            {action && (
                <Button onClick={action.onClick}>{action.label}</Button>
            )}
        </div>
    );
};
