import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { X, FileText, Video, CheckCircle } from 'lucide-react';
import { type LessonCreateData } from '../../api/lesson.api';
import { type MaterialData } from '../../api/course.api';

interface AddLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (lesson: LessonCreateData) => void;
    availableMaterials: MaterialData[];
}

export const AddLessonModal: React.FC<AddLessonModalProps> = ({ isOpen, onClose, onSave, availableMaterials }) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Selected Material States
    const [selectedVideoId, setSelectedVideoId] = useState<string>('');
    const [selectedPdfId, setSelectedPdfId] = useState<string>('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError('Please enter a lesson title');
            return;
        }

        try {
            const lessonData: LessonCreateData = { title };

            // Handle Video (YouTube or Uploaded Video from Library)
            if (selectedVideoId) {
                const videoMaterial = availableMaterials.find(m => m.id === selectedVideoId);
                if (videoMaterial) {
                    if (videoMaterial.type === 'youtube') {
                        lessonData.video = { type: 'youtube', url: videoMaterial.url };
                    } else if (videoMaterial.type === 'video') {
                        lessonData.video = { type: 'upload', url: videoMaterial.url };
                    }
                }
            }

            // Handle PDF
            if (selectedPdfId) {
                const pdfMaterial = availableMaterials.find(m => m.id === selectedPdfId);
                if (pdfMaterial) {
                    lessonData.pdf = { title: pdfMaterial.title, url: pdfMaterial.url };
                }
            }

            onSave(lessonData);
            onClose();

            // Reset form
            setTitle('');
            setSelectedVideoId('');
            setSelectedPdfId('');
        } catch (err: any) {
            console.error('Creation failed:', err);
            setError(err.message || 'Failed to create lesson');
        }
    };

    // Filter materials by type
    const videoMaterials = availableMaterials.filter(m => m.type === 'video' || m.type === 'youtube');
    const pdfMaterials = availableMaterials.filter(m => m.type === 'pdf');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-900">Create New Lesson</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <Input
                        label="Lesson Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g., Introduction to French Verbs"
                        required
                    />

                    {/* Video Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Video Material (Optional)</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                            value={selectedVideoId}
                            onChange={(e) => setSelectedVideoId(e.target.value)}
                        >
                            <option value="">-- Select a Video or YouTube Link --</option>
                            {videoMaterials.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.type === 'youtube' ? '📺' : '🎥'} {m.title}
                                </option>
                            ))}
                        </select>
                        {videoMaterials.length === 0 && (
                            <p className="text-xs text-amber-600">
                                No videos available. Add them to the Materials Library first.
                            </p>
                        )}
                    </div>

                    {/* PDF Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">PDF Material (Optional)</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                            value={selectedPdfId}
                            onChange={(e) => setSelectedPdfId(e.target.value)}
                        >
                            <option value="">-- Select a PDF --</option>
                            {pdfMaterials.map(m => (
                                <option key={m.id} value={m.id}>
                                    📄 {m.title}
                                </option>
                            ))}
                        </select>
                        {pdfMaterials.length === 0 && (
                            <p className="text-xs text-amber-600">
                                No PDFs available. Add them to the Materials Library first.
                            </p>
                        )}
                    </div>

                    {/* Quiz Section Placeholder */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Quiz (Coming Soon)</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Quiz builder will be available in future updates.
                        </div>
                    </div>

                    {/* Selected Material Preview (Mini) */}
                    {(selectedVideoId || selectedPdfId) && (
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                            <p className="font-medium text-gray-700 mb-2">Lesson Content Preview:</p>
                            <ul className="space-y-1 text-gray-600">
                                {selectedVideoId && (
                                    <li className="flex items-center gap-2">
                                        <Video size={14} className="text-blue-500" />
                                        Video: {availableMaterials.find(m => m.id === selectedVideoId)?.title}
                                    </li>
                                )}
                                {selectedPdfId && (
                                    <li className="flex items-center gap-2">
                                        <FileText size={14} className="text-orange-500" />
                                        PDF: {availableMaterials.find(m => m.id === selectedPdfId)?.title}
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Create Lesson</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
