import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AddMaterialModal } from './components/AddMaterialModal';
import { ArrowLeft, Save, GripVertical, Video, Youtube, FileText } from 'lucide-react';
import { useState } from 'react';

export const CourseEditor: React.FC = () => {
    const { courseId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock State
    const [course, setCourse] = useState({
        title: 'French Grammar 101',
        description: 'A complete guide to French grammar.',
        isPaid: false,
        category: 'grammar' as 'grammar' | 'conversation',
        materials: [
            { id: 1, title: 'Introduction', type: 'youtube', isFree: true },
            { id: 2, title: 'Verbs - Present Tense', type: 'video', isFree: false },
            { id: 3, title: 'Quiz 1', type: 'quiz', isFree: false },
        ]
    });

    const handleAddMaterial = (material: any) => {
        setCourse(prev => ({
            ...prev,
            materials: [...prev.materials, { ...material, id: Date.now() }]
        }));
    };

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
                        {courseId === 'new' ? 'New Course' : 'Edit Course'}
                    </h1>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost">Save Draft</Button>
                    <Button>
                        <Save className="w-4 h-4 mr-2" />
                        Publish Course
                    </Button>
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
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 min-h-[120px]"
                                value={course.description}
                                onChange={e => setCourse({ ...course, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Course Curriculum</h2>
                            <Button size="sm" onClick={() => setIsModalOpen(true)}>+ Add Material</Button>
                        </div>

                        {course.materials.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-500">No lessons yet. Start adding content!</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {course.materials.map((item, index) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors group cursor-grab active:cursor-grabbing">
                                        <GripVertical className="text-gray-400 group-hover:text-gray-600" size={20} />
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
                                            {item.type === 'youtube' && <Youtube size={20} />}
                                            {item.type === 'video' && <Video size={20} />}
                                            {item.type === 'quiz' && <FileText size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">
                                                {index + 1}. {item.title}
                                            </h4>
                                            {item.isFree && <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">Free Preview</span>}
                                        </div>
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Edit</Button>
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

            <AddMaterialModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddMaterial}
            />
        </div>
    );
};

export default CourseEditor;
