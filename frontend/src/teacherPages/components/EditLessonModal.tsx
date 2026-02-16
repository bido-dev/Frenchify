import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { X, FileText, Video } from 'lucide-react';
import { type LessonCreateData, type LessonData } from '../../api/lesson.api';
import { type MaterialData } from '../../api/course.api';

interface EditLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (lessonId: string, data: LessonCreateData) => void;
    lesson: LessonData;
    availableMaterials: MaterialData[];
}

export const EditLessonModal: React.FC<EditLessonModalProps> = ({
    isOpen,
    onClose,
    onSave,
    lesson,
    availableMaterials
}) => {
    const [title, setTitle] = useState(lesson.title);
    const [videoType, setVideoType] = useState<'youtube' | 'upload'>(lesson.video?.type || 'youtube');
    const [videoUrl, setVideoUrl] = useState(lesson.video?.url || '');
    const [selectedMaterials, setSelectedMaterials] = useState(lesson.materials || []);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Reset form when lesson changes
    useEffect(() => {
        if (lesson) {
            setTitle(lesson.title);
            setVideoType(lesson.video?.type || 'youtube');
            setVideoUrl(lesson.video?.url || '');
            setSelectedMaterials(lesson.materials || []);
        }
    }, [lesson, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (videoType === 'youtube' && videoUrl && !videoUrl.includes('youtube') && !videoUrl.includes('youtu.be')) {
            newErrors.videoUrl = 'Please enter a valid YouTube URL';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const lessonData: LessonCreateData = {
            title,
            video: videoUrl ? {
                type: videoType,
                url: videoUrl
            } : undefined,
            materials: selectedMaterials
        };

        onSave(lesson.id, lessonData);
        onClose();
    };

    const handleAddMaterial = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const materialId = e.target.value;
        if (!materialId) return;

        const material = availableMaterials.find(m => m.id === materialId);
        if (material && !selectedMaterials.some(m => m.id === material.id)) {
            setSelectedMaterials([...selectedMaterials, {
                id: material.id,
                title: material.title,
                url: material.url,
                type: material.type
            }]);
        }
        // Reset select
        e.target.value = '';
    };

    const handleRemoveMaterial = (materialId: string) => {
        setSelectedMaterials(selectedMaterials.filter(m => m.id !== materialId));
    };

    // Filter out materials that are already selected
    const availableOptions = availableMaterials.filter(
        m => !selectedMaterials.some(selected => selected.id === m.id)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit Lesson</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Lesson Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Introduction to French Verbs"
                            error={errors.title}
                        />

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                <Video className="w-4 h-4 text-blue-600" />
                                Video Content
                            </h3>

                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={videoType === 'youtube'}
                                        onChange={() => setVideoType('youtube')}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">YouTube URL</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={videoType === 'upload'}
                                        onChange={() => setVideoType('upload')}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Direct Upload URL</span>
                                </label>
                            </div>

                            <Input
                                label={videoType === 'youtube' ? 'YouTube URL' : 'Video URL'}
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder={videoType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://example.com/video.mp4'}
                                error={errors.videoUrl}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-orange-600" />
                                Attached Materials
                            </h3>

                            <div className="space-y-3">
                                {selectedMaterials.map(material => (
                                    <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-md ${material.type === 'pdf' ? 'bg-orange-100 text-orange-600' :
                                                material.type === 'youtube' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {material.type === 'pdf' ? <FileText size={14} /> : <Video size={14} />}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{material.title}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMaterial(material.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}

                                {selectedMaterials.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">No materials attached.</p>
                                )}

                                <div className="pt-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Add Material</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                        onChange={handleAddMaterial}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select a material to add...</option>
                                        {availableOptions.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.title} ({m.type})
                                            </option>
                                        ))}
                                        {availableOptions.length === 0 && (
                                            <option disabled>No more materials available</option>
                                        )}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Select from course library to attach.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <Button type="button" variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
