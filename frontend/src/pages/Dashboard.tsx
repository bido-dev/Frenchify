import React, { useState } from 'react';
import { CourseCard, type CourseCardProps } from '../components/CourseCard';
import { Button } from '../components/Button';

// Mock Data
const MOCK_COURSES: Omit<CourseCardProps, 'onAction'>[] = [
    { id: '1', title: 'French Grammar 101', teacherName: 'Marie Currie', isPaid: false, userTier: 'free', thumbnailUrl: '' },
    { id: '2', title: 'Advanced Conversation', teacherName: 'Pierre Dupont', isPaid: true, userTier: 'free', thumbnailUrl: '' },
    { id: '3', title: 'Business French', teacherName: 'Sarah Smith', isPaid: true, userTier: 'free', thumbnailUrl: '' },
    { id: '4', title: 'Daily Vocabulary', teacherName: 'Marie Currie', isPaid: false, userTier: 'free', thumbnailUrl: '' },
    { id: '5', title: 'French Cinema History', teacherName: 'Jean Renoir', isPaid: true, userTier: 'free', thumbnailUrl: '' },
];

export const Dashboard: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'grammar' | 'conversation'>('all');

    const handleCourseAction = (id: string) => {
        console.log(`Navigate to course ${id}`);
        // In real app, navigation logic here
        window.location.href = `/course/${id}`;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Bienvenue, Student!</h1>
                    <p className="text-blue-100 max-w-xl">
                        Ready to continue your French journey today? You have a 3-day streak!
                    </p>
                </div>
                {/* Decorative circle */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 border-b border-gray-200 pb-4">
                <Button
                    variant={filter === 'all' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('all')}
                    className={filter === 'all' ? 'bg-gray-800 hover:bg-gray-700' : ''}
                >
                    All Courses
                </Button>
                <Button
                    variant={filter === 'grammar' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('grammar')}
                    className={filter === 'grammar' ? 'bg-gray-800 hover:bg-gray-700' : ''}
                >
                    Grammar
                </Button>
                <Button
                    variant={filter === 'conversation' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('conversation')}
                    className={filter === 'conversation' ? 'bg-gray-800 hover:bg-gray-700' : ''}
                >
                    Conversation
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MOCK_COURSES.map(course => (
                    <CourseCard
                        key={course.id}
                        {...course}
                        onAction={handleCourseAction}
                    />
                ))}
            </div>
        </div>
    );
};
