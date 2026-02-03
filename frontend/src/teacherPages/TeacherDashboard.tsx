import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Plus, Edit, Trash2, BookOpen, Users } from 'lucide-react';
import { Header } from '../components/Header';

// Mock Data
const MOCK_TEACHER_COURSES = [
    { id: '1', title: 'French Grammar 101', students: 120, status: 'published', isPaid: false },
    { id: '2', title: 'Advanced Conversation', students: 45, status: 'draft', isPaid: true },
    { id: '3', title: 'Business French', students: 80, status: 'published', isPaid: true },
];

export const TeacherDashboard: React.FC = () => {
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
                            <p className="text-2xl font-bold text-gray-900">3</p>
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
                            <p className="text-2xl font-bold text-gray-900">245</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                            <Plus size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                            <p className="text-2xl font-bold text-gray-900">5</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-700">My Courses</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {MOCK_TEACHER_COURSES.map((course) => (
                        <div key={course.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{course.title}</h4>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                        <Badge variant={course.status === 'published' ? 'free' : 'neutral'} text={course.status} />
                                        <span>•</span>
                                        <span>{course.students} Students</span>
                                        <span>•</span>
                                        <Badge variant={course.isPaid ? 'pro' : 'free'} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link to={`/teacher/course/${course.id}/edit`}>
                                    <Button variant="ghost" size="sm">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
