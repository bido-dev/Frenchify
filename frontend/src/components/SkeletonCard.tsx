import React from 'react';

export const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
            {/* Thumbnail skeleton */}
            <div className="aspect-video bg-gray-200"></div>

            {/* Body skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                {/* Teacher name */}
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                {/* Button */}
                <div className="h-9 bg-gray-200 rounded w-full mt-4"></div>
            </div>
        </div>
    );
};
