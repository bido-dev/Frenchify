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

    // Lesson Data
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [selectedPdfId, setSelectedPdfId] = useState<string>('');
    const [selectedQuizId, setSelectedQuizId] = useState<string>('');

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

            // Handle YouTube Video
            if (youtubeUrl.trim()) {
                // Simple validation for YouTube URL structure could be added here
                lessonData.video = {
                    type: 'youtube',
                    url: youtubeUrl.trim()
                };
            }

            // Handle PDF
            if (selectedPdfId) {
                const pdfMaterial = availableMaterials.find(m => m.id === selectedPdfId);
                if (pdfMaterial) {
                    lessonData.pdf = { title: pdfMaterial.title, url: pdfMaterial.url };
                }
            }

            // Handle Quiz
            if (selectedQuizId) {
                const quizMaterial = availableMaterials.find(m => m.id === selectedQuizId);
                if (quizMaterial) {
                    lessonData.quiz = { id: quizMaterial.id, title: quizMaterial.title, url: quizMaterial.url };
                }
            }

            onSave(lessonData);
            onClose();

            // Reset form
            setTitle('');
            setYoutubeUrl('');
            setSelectedPdfId('');
            setSelectedQuizId('');
        } catch (err: any) {
            console.error('Creation failed:', err);
            setError(err.message || 'Failed to create lesson');
        }
    };

    // Filter materials by type
    const pdfMaterials = availableMaterials.filter(m => m.type === 'pdf');
    const quizMaterials = availableMaterials.filter(m => m.type === 'quiz');

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

                    {/* YouTube Video URL */}
                    <Input
                        label="YouTube Video URL (Optional)"
                        value={youtubeUrl}
                        onChange={e => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />

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

                    {/* Quiz Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Quiz (Optional)</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                            value={selectedQuizId}
                            onChange={(e) => setSelectedQuizId(e.target.value)}
                        >
                            <option value="">-- Select a Quiz --</option>
                            {quizMaterials.map(m => (
                                <option key={m.id} value={m.id}>
                                    🧠 {m.title}
                                </option>
                            ))}
                        </select>
                        {quizMaterials.length === 0 && (
                            <p className="text-xs text-amber-600">
                                No quizzes available. Generate one in the Materials Library first.
                            </p>
                        )}
                    </div>

                    {/* Selected Material Preview (Mini) */}
                    {(youtubeUrl || selectedPdfId || selectedQuizId) && (
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                            <p className="font-medium text-gray-700 mb-2">Lesson Content Preview:</p>
                            <ul className="space-y-1 text-gray-600">
                                {youtubeUrl && (
                                    <li className="flex items-center gap-2">
                                        <Video size={14} className="text-blue-500" />
                                        Video: {youtubeUrl}
                                    </li>
                                )}
                                {selectedPdfId && (
                                    <li className="flex items-center gap-2">
                                        <FileText size={14} className="text-orange-500" />
                                        PDF: {availableMaterials.find(m => m.id === selectedPdfId)?.title}
                                    </li>
                                )}
                                {selectedQuizId && (
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        Quiz: {availableMaterials.find(m => m.id === selectedQuizId)?.title}
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
