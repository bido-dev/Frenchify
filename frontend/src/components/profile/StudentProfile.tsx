import React, { useEffect, useState } from 'react';
import { Book, CheckCircle, Clock, Trophy, PlayCircle } from 'lucide-react';
import type { StudentStats, EnrolledCourse } from '../../api/student.api';
import { getStudentStats, getEnrolledCourses } from '../../api/student.api';
import { Badge } from '../../components/Badge';
import { Link } from 'react-router-dom';
import { StatCard } from './StatCard';

export const StudentProfile: React.FC = () => {
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch stats and courses in parallel
                const [statsData, coursesData] = await Promise.all([
                    getStudentStats(),
                    getEnrolledCourses()
                ]);
                setStats(statsData);
                setCourses(coursesData);
            } catch (err) {
                console.error('Failed to fetch student data:', err);
                setError('Failed to load student profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
                    ))}
                </div>
                <div className="h-64 bg-gray-100 rounded-xl"></div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Book className="w-5 h-5" />}
                    label="Enrolled"
                    value={stats?.enrolledCount || 0}
                    subLabel="Active Courses"
                    color="blue"
                />
                <StatCard
                    icon={<CheckCircle className="w-5 h-5" />}
                    label="Completed"
                    value={stats?.completedCount || 0}
                    subLabel="Finished Courses"
                    color="green"
                />
                <StatCard
                    icon={<Clock className="w-5 h-5" />}
                    label="Learning Time"
                    value={`${stats?.totalHours || 0}h`}
                    subLabel="Total Hours"
                    color="purple"
                />
                <StatCard
                    icon={<Trophy className="w-5 h-5" />}
                    label="Current Streak"
                    value={`${stats?.currentStreak || 0} 🔥`}
                    subLabel="Daily Streak"
                    color="amber"
                />
            </div>

            {/* Recent Activity / Current Courses */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-blue-600" />
                        Continue Learning
                    </h2>
                    <Link to="/courses" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Browse All Courses
                    </Link>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Book className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-medium text-lg mb-2">No courses yet</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start your French learning journey today by exploring our course catalog.</p>
                        <Link to="/courses" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {courses.map(course => (
                            <div key={course.id} className="group flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl hover:bg-blue-50/50 hover:border-blue-100 transition-all duration-200">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{course.title}</h3>
                                            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">{course.category}</span>
                                        </div>
                                        <Badge
                                            variant={course.progress === 100 ? 'success' : 'neutral'}
                                            text={course.progress === 100 ? 'COMPLETED' : `${course.progress}%`}
                                            className={course.progress === 100 ? '' : 'bg-gray-100 text-gray-600'}
                                        />
                                    </div>

                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>Last accessed: {course.lastAccessedAt ? new Date(course.lastAccessedAt).toLocaleDateString() : 'Never'}</span>
                                        </div>

                                        {course.progress < 100 ? (
                                            <Link
                                                to={`/courses/${course.id}`}
                                                className="inline-flex items-center px-3 py-1 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors font-medium shadow-sm"
                                            >
                                                Continue
                                                <PlayCircle className="w-3 h-3 ml-1.5" />
                                            </Link>
                                        ) : (
                                            <Link
                                                to={`/courses/${course.id}`}
                                                className="text-green-600 hover:text-green-700 font-medium hover:underline"
                                            >
                                                Review Course
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
