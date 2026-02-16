import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AddLessonModal } from './components/AddLessonModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { ArrowLeft, Save, Video, Youtube, FileText, Trash2, AlertCircle, BookOpen, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    createCourse,
    getCourse,
    updateCourse,
    publishCourse,
} from '../api/course.api';
import {
    createLesson,
    getCourseLessons,
    deleteLesson,
    updateLesson,
    type LessonData,
    type LessonCreateData,
} from '../api/lesson.api';
import { AddMaterialModal } from './components/AddMaterialModal';
import { EditLessonModal } from './components/EditLessonModal';
import {
    getCourseMaterials,
    addMaterial,
    deleteMaterial,
    type MaterialData,
    type MaterialCreateData
} from '../api/course.api';

export const CourseEditor: React.FC = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const isNew = !courseId || courseId === 'new';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

    // Delete lesson state
    const [deletingLesson, setDeletingLesson] = useState<LessonData | null>(null);
    const [editingLesson, setEditingLesson] = useState<LessonData | null>(null);

    const [deleteLoading, setDeleteLoading] = useState(false);

    // Delete material state
    const [deletingMaterial, setDeletingMaterial] = useState<MaterialData | null>(null);
    const [deleteMaterialLoading, setDeleteMaterialLoading] = useState(false);

    // Course form state
    const [course, setCourse] = useState({
        title: '',
        description: '',
        isPaid: false,
        category: 'grammar' as 'grammar' | 'conversation',
        status: 'draft' as 'draft' | 'published',
    });

    const [lessons, setLessons] = useState<LessonData[]>([]);
    const [materials, setMaterials] = useState<MaterialData[]>([]);
    const [savedCourseId, setSavedCourseId] = useState<string | null>(isNew ? null : courseId!);

    // Load existing course data
    useEffect(() => {
        if (!isNew && courseId) {
            const loadCourse = async () => {
                try {
                    setLoading(true);
                    const [courseData, lessonsData, materialsData] = await Promise.all([
                        getCourse(courseId),
                        getCourseLessons(courseId),
                        getCourseMaterials(courseId),
                    ]);
                    setCourse({
                        title: courseData.title,
                        description: courseData.description,
                        isPaid: courseData.isPaid,
                        category: courseData.category,
                        status: courseData.status,
                    });
                    setLessons(lessonsData);
                    setMaterials(materialsData);
                } catch (err: any) {
                    console.error('Error loading course:', err);
                    setError(err.response?.data?.message || err.message || 'Failed to load course.');
                } finally {
                    setLoading(false);
                }
            };
            loadCourse();
        }
    }, [courseId, isNew]);

    const handleSaveDraft = async () => {
        if (!course.title.trim()) {
            setToast({ message: 'Course title is required.', variant: 'error' });
            return;
        }

        setSaving(true);
        try {
            if (savedCourseId) {
                // Update existing course
                await updateCourse(savedCourseId, {
                    title: course.title,
                    description: course.description,
                    category: course.category,
                    isPaid: course.isPaid,
                });
                setToast({ message: 'Course saved successfully.', variant: 'success' });
            } else {
                // Create new course
                const result = await createCourse({
                    title: course.title,
                    description: course.description,
                    category: course.category,
                    isPaid: course.isPaid,
                });
                setSavedCourseId(result.id);
                // Update the URL so refreshing loads the course
                navigate(`/teacher/course/${result.id}/edit`, { replace: true });
                setToast({ message: 'Course created as draft.', variant: 'success' });
            }
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || 'Failed to save course.', variant: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!savedCourseId) {
            setToast({ message: 'Save the course first before publishing.', variant: 'error' });
            return;
        }

        setPublishing(true);
        try {
            await publishCourse(savedCourseId);
            setCourse(prev => ({ ...prev, status: 'published' }));
            setToast({ message: 'Course published live!', variant: 'success' });
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || 'Failed to publish course.', variant: 'error' });
        } finally {
            setPublishing(false);
        }
    };

    const handleAddLesson = async (lessonData: LessonCreateData) => {
        if (!savedCourseId) {
            setToast({ message: 'Save the course first before adding lessons.', variant: 'error' });
            return;
        }

        try {
            await createLesson(savedCourseId, lessonData);
            // Reload lessons
            const updated = await getCourseLessons(savedCourseId);
            setLessons(updated);
            setToast({ message: 'Lesson created successfully.', variant: 'success' });
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || 'Failed to create lesson.', variant: 'error' });
        }
    };

    const handleUpdateLesson = async (lessonId: string, lessonData: LessonCreateData) => {
        if (!savedCourseId) return;

        try {
            await updateLesson(savedCourseId, lessonId, lessonData);
            // Reload lessons
            const updated = await getCourseLessons(savedCourseId);
            setLessons(updated);
            setToast({ message: 'Lesson updated successfully.', variant: 'success' });
            setEditingLesson(null);
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || 'Failed to update lesson.', variant: 'error' });
        }
    };

    const handleAddMaterial = async (materialData: MaterialCreateData) => {
        if (!savedCourseId) {
            setToast({ message: 'Save the course first before adding materials.', variant: 'error' });
            return;
        }

        try {
            await addMaterial(savedCourseId, materialData);
            // Reload materials
            const updated = await getCourseMaterials(savedCourseId);
            setMaterials(updated);
            setToast({ message: 'Material added successfully.', variant: 'success' });
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || 'Failed to add material.', variant: 'error' });
        }
    };

    const handleDeleteLesson = async () => {
        if (!savedCourseId || !deletingLesson) return;

        setDeleteLoading(true);
        try {
            await deleteLesson(savedCourseId, deletingLesson.id);
            setLessons(prev => prev.filter(l => l.id !== deletingLesson.id));
            setToast({ message: 'Lesson deleted.', variant: 'success' });
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || 'Failed to delete lesson.', variant: 'error' });
        } finally {
            setDeleteLoading(false);
            setDeletingLesson(null);
        }
    };

    const handleDeleteMaterial = async () => {
        if (!savedCourseId || !deletingMaterial) return;

        setDeleteMaterialLoading(true);
        try {
            await deleteMaterial(savedCourseId, deletingMaterial.id);
            setMaterials(prev => prev.filter(m => m.id !== deletingMaterial.id));
            setToast({ message: 'Material deleted.', variant: 'success' });
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || 'Failed to delete material.', variant: 'error' });
        } finally {
            setDeleteMaterialLoading(false);
            setDeletingMaterial(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" text="Loading course..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto py-12">
                <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-3" />
                    <h3 className="text-lg font-medium text-red-800">Failed to load course</h3>
                    <p className="text-red-600 mt-1">{error}</p>
                    <Link to="/teacher/dashboard">
                        <Button className="mt-4">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/teacher/dashboard">
                        <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent">
                            <ArrowLeft className="w-5 h-5 mr-1" /> Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isNew && !savedCourseId ? 'New Course' : 'Edit Course'}
                    </h1>
                    {course.status === 'published' && (
                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">Published</span>
                    )}
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={handleSaveDraft} isLoading={saving} disabled={publishing}>
                        Save Draft
                    </Button>
                    {course.status !== 'published' && (
                        <Button onClick={handlePublish} isLoading={publishing} disabled={saving || !savedCourseId}>
                            <Save className="w-4 h-4 mr-2" />
                            Publish Course
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main: Course Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                        <Input
                            label="Course Title"
                            value={course.title}
                            onChange={e => setCourse({ ...course, title: e.target.value })}
                            placeholder="e.g., French Grammar 101"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 min-h-[120px]"
                                value={course.description}
                                onChange={e => setCourse({ ...course, description: e.target.value })}
                                placeholder="Describe what students will learn..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Course Curriculum</h2>
                            <Button
                                size="sm"
                                onClick={() => {
                                    if (!savedCourseId) {
                                        setToast({ message: 'Save the course first before adding lessons.', variant: 'error' });
                                        return;
                                    }
                                    setIsModalOpen(true);
                                }}
                            >
                                + Add Lesson
                            </Button>
                        </div>

                        {lessons.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <BookOpen className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                                <p className="text-gray-500">No lessons yet. Start teaching!</p>
                                {!savedCourseId && (
                                    <p className="text-xs text-gray-400 mt-1">Save the course first to add lessons.</p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lessons.map((lesson, index) => (
                                    <div key={lesson.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors group">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-500 hover:text-blue-700 h-8 w-8 p-0"
                                                    onClick={() => setEditingLesson(lesson)}
                                                >
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                                    onClick={() => setDeletingLesson(lesson)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pl-11">
                                            {lesson.video && (
                                                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${lesson.video.type === 'youtube' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                                    {lesson.video.type === 'youtube' ? <Youtube size={12} /> : <Video size={12} />}
                                                    Video
                                                </span>
                                            )}
                                            {lesson.pdf && (
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-orange-50 text-orange-700">
                                                    <FileText size={12} />
                                                    PDF
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Materials Library</h2>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                    if (!savedCourseId) {
                                        setToast({ message: 'Save the course first before adding materials.', variant: 'error' });
                                        return;
                                    }
                                    setIsMaterialModalOpen(true);
                                }}
                            >
                                + Add Material
                            </Button>
                        </div>

                        {materials.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <FileText className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500">No materials yet.</p>
                                {!savedCourseId && (
                                    <p className="text-xs text-gray-400 mt-1">Save course to add materials.</p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {materials.map((material) => (
                                    <div key={material.id} className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between hover:border-blue-300 transition-colors group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`p-2 rounded-md ${material.type === 'youtube' ? 'bg-red-50 text-red-600' :
                                                material.type === 'video' ? 'bg-blue-50 text-blue-600' :
                                                    material.type === 'pdf' ? 'bg-orange-50 text-orange-600' :
                                                        'bg-amber-50 text-amber-600'
                                                }`}>
                                                {material.type === 'youtube' && <Youtube size={16} />}
                                                {material.type === 'video' && <Video size={16} />}
                                                {material.type === 'pdf' && <FileText size={16} />}
                                                {material.type === 'quiz' && <BookOpen size={16} />}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-medium text-gray-900 text-sm truncate">{material.title}</h4>
                                                <p className="text-xs text-gray-500 capitalize">{material.type}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                            onClick={() => setDeletingMaterial(material)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Settings */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Course Settings</h3>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                                <p className="font-medium text-gray-900">Paid Course</p>
                                <p className="text-xs text-gray-500">Requires subscription</p>
                            </div>
                            <div
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${course.isPaid ? 'bg-blue-600' : 'bg-gray-200'}`}
                                onClick={() => setCourse({ ...course, isPaid: !course.isPaid })}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${course.isPaid ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                                <p className="font-medium text-gray-900">Category</p>
                                <p className="text-xs text-gray-500">Course type</p>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setCourse({ ...course, category: 'grammar' })}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${course.category === 'grammar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Grammar
                                </button>
                                <button
                                    onClick={() => setCourse({ ...course, category: 'conversation' })}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${course.category === 'conversation' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Conversation
                                </button>
                            </div>
                        </div>

                        <div className="py-4">
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="text-center">
                                    <div className="mx-auto w-8 h-8 mb-2 text-gray-400">📷</div>
                                    <span className="text-xs text-gray-500 font-medium">Upload Thumbnail</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddLessonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddLesson}
                availableMaterials={materials}
            />

            <AddMaterialModal
                isOpen={isMaterialModalOpen}
                onClose={() => setIsMaterialModalOpen(false)}
                onSave={handleAddMaterial}
            />

            {editingLesson && (
                <EditLessonModal
                    isOpen={!!editingLesson}
                    onClose={() => setEditingLesson(null)}
                    onSave={handleUpdateLesson}
                    lesson={editingLesson}
                    availableMaterials={materials}
                />
            )}

            {/* Delete Lesson Modal */}
            <Modal
                isOpen={!!deletingLesson}
                onClose={() => setDeletingLesson(null)}
                title="Delete Lesson"
                variant="danger"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setDeletingLesson(null)} disabled={deleteLoading}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteLesson} isLoading={deleteLoading}>Delete</Button>
                    </div>
                }
            >
                <p className="text-gray-600">
                    Are you sure you want to delete <strong>"{deletingLesson?.title}"</strong>?
                </p>
            </Modal>

            {/* Delete Material Modal */}
            <Modal
                isOpen={!!deletingMaterial}
                onClose={() => setDeletingMaterial(null)}
                title="Delete Material"
                variant="danger"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setDeletingMaterial(null)} disabled={deleteMaterialLoading}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteMaterial} isLoading={deleteMaterialLoading}>Delete</Button>
                    </div>
                }
            >
                <p className="text-gray-600">
                    Are you sure you want to delete <strong>"{deletingMaterial?.title}"</strong>?
                    <br />
                    <span className="text-xs text-red-500 mt-1 block">This will remove it from any lessons using it.</span>
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

export default CourseEditor;
