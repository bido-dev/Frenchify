import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseCard, type CourseCardProps } from '../components/CourseCard';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/SkeletonCard';
import { BookOpen } from 'lucide-react';

// Mock Data
const MOCK_COURSES: Omit<CourseCardProps, 'onAction'>[] = [
    { id: '1', title: 'French Grammar 101', teacherName: 'Marie Currie', isPaid: false, userTier: 'free', thumbnailUrl: '', category: 'grammar' },
    { id: '2', title: 'Advanced Conversation', teacherName: 'Pierre Dupont', isPaid: true, userTier: 'free', thumbnailUrl: '', category: 'conversation' },
    { id: '3', title: 'Business French', teacherName: 'Sarah Smith', isPaid: true, userTier: 'free', thumbnailUrl: '', category: 'conversation' },
    { id: '4', title: 'Daily Vocabulary', teacherName: 'Marie Currie', isPaid: false, userTier: 'free', thumbnailUrl: '', category: 'grammar' },
    { id: '5', title: 'French Cinema History', teacherName: 'Jean Renoir', isPaid: true, userTier: 'free', thumbnailUrl: '', category: 'conversation' },
];

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'grammar' | 'conversation'>('all');
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading courses
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Filter courses based on category
    const filteredCourses = MOCK_COURSES.filter(course => {
        if (filter === 'all') return true;
        return course.category === filter;
    });

    const handleCourseAction = (id: string) => {
        navigate(`/course/${id}`);
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
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : filteredCourses.length === 0 ? (
                <EmptyState
                    icon={BookOpen}
                    title="No courses found"
                    description="Try adjusting your filters or check back later for new content."
                    action={{
                        label: "View All Courses",
                        onClick: () => setFilter('all')
                    }}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map(course => (
                        <CourseCard
                            key={course.id}
                            {...course}
                            onAction={handleCourseAction}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
