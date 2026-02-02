import React from 'react';
import { Lock, PlayCircle } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';

export interface CourseCardProps {
    id: string;
    title: string;
    teacherName: string;
    thumbnailUrl: string; // Placeholder or actual URL
    isPaid: boolean;
    userTier: 'free' | 'paid';
    onAction: (id: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    id,
    title,
    teacherName,
    thumbnailUrl,
    isPaid,
    userTier,
    onAction
}) => {
    const isLocked = isPaid && userTier === 'free';

    return (
        <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <div className={`relative aspect-video bg-gray-100 ${isLocked ? 'grayscale' : ''}`}>
                {/* Placeholder Image if no URL provided - using a colored div for now or simple img tag */}
                {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                        <PlayCircle size={48} />
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute top-3 right-3">
                    <Badge variant={isPaid ? 'pro' : 'free'} />
                </div>

                {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <Lock className="text-white w-12 h-12 opacity-90" />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-1">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">Par {teacherName}</p>

                <Button
                    variant={isLocked ? 'primary' : 'primary'} // Visual cue, maybe secondary if unlocked? For now primary.
                    size="sm"
                    className="w-full"
                    onClick={() => onAction(id)}
                >
                    {isLocked ? 'Unlock Course' : 'Continue Learning'}
                </Button>
            </div>
        </div>
    );
};
