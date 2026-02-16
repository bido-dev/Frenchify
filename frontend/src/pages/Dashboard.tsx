import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseCard } from '../components/CourseCard';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/SkeletonCard';
import { UpgradeModal } from '../components/UpgradeModal';
import { BookOpen } from 'lucide-react';
import { getCourses, type Course } from '../api/student.api';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [filter, setFilter] = useState<'all' | 'grammar' | 'conversation'>('all');
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    // Fetch courses from API
    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                // Pass undefined if filter is 'all', otherwise pass the category
                const category = filter === 'all' ? undefined : filter;
                const data = await getCourses(category);
                setCourses(data);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [filter]);

    const handleCourseAction = (id: string) => {
        const course = courses.find(c => c.id === id);
        if (!course) return;

        // Check availability logic
        const isLocked = course.isPaid && user?.tier === 'free';

        if (isLocked) {
            setIsUpgradeModalOpen(true);
        } else {
            navigate(`/course/${id}`);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Bienvenue, {user?.name || 'Student'}!</h1>
                    <p className="text-blue-100 max-w-xl">
                        Ready to continue your French journey today?
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
            ) : courses.length === 0 ? (
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
                    {courses.map(course => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            title={course.title}
                            teacherName={course.teacherName}
                            thumbnailUrl="" // API doesn't return thumbnail yet
                            isPaid={course.isPaid}
                            userTier={user?.tier || 'free'}
                            category={course.category}
                            onAction={handleCourseAction}
                        />
                    ))}
                </div>
            )}

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;

