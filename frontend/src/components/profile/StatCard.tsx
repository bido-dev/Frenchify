import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    subLabel?: string;
    color: 'blue' | 'green' | 'purple' | 'amber' | 'red';
}

const colorStyles = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'hover:border-blue-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'hover:border-green-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'hover:border-purple-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'hover:border-amber-200' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'hover:border-red-200' }
};

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subLabel, color }) => {
    const styles = colorStyles[color];

    return (
        <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-colors ${styles.border}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${styles.bg}`}>
                <div className={styles.text}>{icon}</div>
            </div>
            <div>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {subLabel && <p className="text-xs text-gray-400">{subLabel}</p>}
            </div>
        </div>
    );
};
