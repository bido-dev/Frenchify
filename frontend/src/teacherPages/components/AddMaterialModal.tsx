import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { X, Youtube, Upload, FileText, CheckCircle, AlertCircle, Video } from 'lucide-react';
import { storage, auth } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface AddMaterialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (material: any) => void;
}

type MaterialType = 'youtube' | 'video' | 'quiz' | 'pdf';

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({ isOpen, onClose, onSave }) => {
    const [type, setType] = useState<MaterialType>('youtube');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // URL for YouTube
    const [file, setFile] = useState<File | null>(null);
    const [isFree, setIsFree] = useState(false);

    // Upload state
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const uploadFile = async (): Promise<string> => {
        if (!file) throw new Error('No file selected');
        if (!auth.currentUser) throw new Error('User not authenticated');

        // Create a reference to 'materials/uid/timestamp_filename'
        const timestamp = Date.now();
        const storageRef = ref(storage, `materials/${auth.currentUser.uid}/${timestamp}_${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            setUploading(true);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                },
                (error) => {
                    setUploading(false);
                    setError(error.message);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setUploading(false);
                        resolve(downloadURL);
                    } catch (err) {
                        setUploading(false);
                        reject(err);
                    }
                }
            );
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError('Please enter a lesson title');
            return;
        }

        try {
            let finalContent = content;

            // Handle file upload for video/pdf
            if (type === 'video' || type === 'pdf') {
                if (!file) {
                    setError('Please select a file to upload');
                    return;
                }
                finalContent = await uploadFile();
            } else if (type === 'youtube' && !content) {
                setError('Please enter a YouTube URL');
                return;
            }

            onSave({ type, title, url: finalContent, isFreePreview: isFree });
            onClose();
            // Reset form
            setTitle('');
            setContent('');
            setFile(null);
            setIsFree(false);
            setProgress(0);
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'Failed to upload material');
        }
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
                        <div className="grid grid-cols-4 gap-2">
                            <button
                                type="button"
                                onClick={() => setType('youtube')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${type === 'youtube' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <Youtube className="mb-2 w-5 h-5" />
                                <span className="text-[10px] font-medium uppercase">YouTube</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('video')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${type === 'video' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <Upload className="mb-2 w-5 h-5" />
                                <span className="text-[10px] font-medium uppercase">Video Upload</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('pdf')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${type === 'pdf' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <FileText className="mb-2 w-5 h-5" />
                                <span className="text-[10px] font-medium uppercase">PDF File</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('quiz')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${type === 'quiz' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <CheckCircle className="mb-2 w-5 h-5" />
                                <span className="text-[10px] font-medium uppercase">Quiz</span>
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

                    {(type === 'video' || type === 'pdf') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload {type === 'video' ? 'Video' : 'PDF'}
                            </label>

                            {!file ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
                                    <input
                                        type="file"
                                        accept={type === 'video' ? "video/mp4,video/webm" : "application/pdf"}
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {type === 'video' ? 'MP4, WebM (max 100MB)' : 'PDF (max 10MB)'}
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="bg-blue-100 p-2 rounded-md">
                                            {type === 'video' ? <Video size={20} className="text-blue-600" /> : <FileText size={20} className="text-blue-600" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-blue-900 truncate">{file.name}</p>
                                            <p className="text-xs text-blue-700">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="p-1 hover:bg-blue-100 rounded-full text-blue-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {uploading && (
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between text-xs font-medium text-gray-600">
                                        <span>Uploading...</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
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

                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={uploading}>Cancel</Button>
                        <Button type="submit" isLoading={uploading}>
                            {uploading ? 'Uploading...' : 'Save Material'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
