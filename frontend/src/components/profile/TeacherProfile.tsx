import React, { useEffect, useState } from 'react';
import { Layout, Users, FileText, AlertCircle, PlusCircle, Edit } from 'lucide-react';
import type { TeacherStats, TeacherCourse } from '../../api/teacher.api';
import { getTeacherStats, getTeacherCourses } from '../../api/teacher.api';
import { Badge } from '../../components/Badge';
import { Link } from 'react-router-dom';
import { StatCard } from './StatCard';
import { useAuth } from '../../contexts/AuthContext';

export const TeacherProfile: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<TeacherStats | null>(null);
    const [courses, setCourses] = useState<TeacherCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, coursesData] = await Promise.all([
                    getTeacherStats(),
                    getTeacherCourses()
                ]);
                setStats(statsData);
                setCourses(coursesData);
            } catch (err) {
                console.error('Failed to fetch teacher data:', err);
                setError('Failed to load teacher profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-24 bg-gray-100 rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
                    ))}
                </div>
                <div className="h-64 bg-gray-100 rounded-xl"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Approval Banner */}
            {user?.status === 'pending' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-amber-800">Account Pending Approval</h3>
                        <p className="text-sm text-amber-700 mt-1">
                            Your teacher account is currently under review by our administrators.
                            You can create courses in draft mode, but you cannot publish them until approved.
                        </p>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    icon={<Layout className="w-5 h-5" />}
                    label="Courses Created"
                    value={stats?.coursesCreated || 0}
                    subLabel="Total Courses"
                    color="blue"
                />
                <StatCard
                    icon={<Users className="w-5 h-5" />}
                    label="Total Students"
                    value={stats?.totalStudents || 0}
                    subLabel="Across all courses"
                    color="purple"
                />
                <StatCard
                    icon={<FileText className="w-5 h-5" />}
                    label="Pending Questions"
                    value={stats?.pendingQuestions || 0}
                    subLabel="Need answers"
                    color="amber"
                />
            </div>

            {/* My Courses */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Layout className="w-5 h-5 text-blue-600" />
                        My Courses
                    </h2>
                    <Link
                        to="/courses/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create Course
                    </Link>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Layout className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-medium text-lg mb-2">No courses created</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Share your knowledge! Create your first course to start teaching.</p>
                        <Link to="/courses/create" className="text-blue-600 hover:text-blue-700 font-medium">
                            Create First Course
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">
                                                    {course.title.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                                    <div className="text-sm text-gray-500 capitalize">{course.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge
                                                variant={course.status === 'published' ? 'success' : 'neutral'}
                                                text={course.status}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {course.enrolledCount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(course.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/teacher/courses/${course.id}`} className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};
