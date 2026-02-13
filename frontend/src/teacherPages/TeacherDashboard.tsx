import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Plus, Edit, Trash2, BookOpen, Users, MessageCircle, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { getTeacherStats, getTeacherCourses, type TeacherStats, type TeacherCourse } from '../api/teacher.api';
import { deleteCourse } from '../api/course.api';

export const TeacherDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<TeacherStats | null>(null);
    const [courses, setCourses] = useState<TeacherCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Delete state
    const [deleteTarget, setDeleteTarget] = useState<TeacherCourse | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [statsData, coursesData] = await Promise.all([
                getTeacherStats(),
                getTeacherCourses()
            ]);
            setStats(statsData);
            setCourses(coursesData);
        } catch (err: any) {
            console.error('Error fetching teacher data:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteCourse(deleteTarget.id);
            setCourses(prev => prev.filter(c => c.id !== deleteTarget.id));
            setStats(prev => prev ? { ...prev, coursesCreated: prev.coursesCreated - 1 } : prev);
            setToast({ message: `"${deleteTarget.title}" deleted successfully.`, variant: 'success' });
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || 'Failed to delete course.', variant: 'error' });
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" text="Loading dashboard..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto py-12">
                <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-3" />
                    <h3 className="text-lg font-medium text-red-800">Failed to load dashboard</h3>
                    <p className="text-red-600 mt-1">{error}</p>
                    <Button onClick={fetchData} className="mt-4">Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <Header />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                    <p className="text-gray-500">Manage your language courses and content.</p>
                </div>
                <Link to="/teacher/course/new">
                    <Button>
                        <Plus className="w-5 h-5 mr-2" />
                        Create Course
                    </Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Courses</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.coursesCreated ?? 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Students</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalStudents ?? 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                            <MessageCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Questions</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.pendingQuestions ?? 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-700">My Courses</h3>
                </div>
                {courses.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No courses yet</h3>
                        <p className="text-gray-500 mt-1">Create your first French course to get started.</p>
                        <Link to="/teacher/course/new">
                            <Button className="mt-4">
                                <Plus className="w-4 h-4 mr-2" /> Create Course
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {courses.map((course) => (
                            <div key={course.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="h-16 w-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-gray-900 truncate">{course.title}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 flex-wrap">
                                            <Badge variant={course.status === 'published' ? 'success' : 'neutral'} text={course.status} />
                                            <span>•</span>
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                {course.category === 'grammar' ? 'Grammar' : 'Conversation'}
                                            </span>
                                            <span>•</span>
                                            <span>{course.enrolledCount} Students</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/teacher/course/${course.id}/edit`)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(course)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Delete Course"
                variant="danger"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} isLoading={deleting}>
                            Delete
                        </Button>
                    </div>
                }
            >
                <p className="text-gray-600">
                    Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>? This will permanently remove the course, all materials, and student questions.
                </p>
            </Modal>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.variant}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default TeacherDashboard;
