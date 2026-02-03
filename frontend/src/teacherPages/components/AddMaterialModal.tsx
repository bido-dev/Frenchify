import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { X, Youtube, Upload, FileText } from 'lucide-react';

interface AddMaterialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (material: any) => void;
}

type MaterialType = 'youtube' | 'video' | 'quiz';

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({ isOpen, onClose, onSave }) => {
    const [type, setType] = useState<MaterialType>('youtube');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // URL or filename
    const [isFree, setIsFree] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ type, title, content, isFree });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-900">Add New Material</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Material Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setType('youtube')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${type === 'youtube' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <Youtube className="mb-2 w-6 h-6" />
                                <span className="text-xs font-medium">YouTube</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('video')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${type === 'video' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <Upload className="mb-2 w-6 h-6" />
                                <span className="text-xs font-medium">Upload</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('quiz')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${type === 'quiz' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <FileText className="mb-2 w-6 h-6" />
                                <span className="text-xs font-medium">Quiz</span>
                            </button>
                        </div>
                    </div>

                    <Input
                        label="Lesson Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g., Introduction to Verbs"
                        required
                    />

                    {type === 'youtube' && (
                        <Input
                            label="YouTube URL"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                        />
                    )}

                    {type === 'video' && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Drag and drop or click to upload video</p>
                        </div>
                    )}
                    {type === 'quiz' && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-amber-50 text-amber-800 text-sm">
                            Quiz builder will be available after saving the lesson title.
                        </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <input
                            type="checkbox"
                            id="free-preview"
                            checked={isFree}
                            onChange={e => setIsFree(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="free-preview" className="text-sm font-medium text-gray-700">
                            Enable Free Preview
                            <p className="text-xs text-gray-500 font-normal">Allow free tier users to access this material</p>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Material</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
