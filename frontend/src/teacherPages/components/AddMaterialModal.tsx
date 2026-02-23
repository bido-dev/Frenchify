import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { X, Upload, FileText, CheckCircle, AlertCircle, Video, Sparkles, Loader2 } from 'lucide-react';
import { storage, auth } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { generateQuiz, getCourseMaterials, type QuizQuestion, type QuestionType, type QuizLanguage, type QuizDifficulty, type MaterialData } from '../../api/course.api';

interface AddMaterialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (material: any) => void;
    courseId: string;
}

type MaterialType = 'video' | 'quiz' | 'pdf';

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({ isOpen, onClose, onSave, courseId }) => {
    const [type, setType] = useState<MaterialType>('video');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // URL for YouTube
    const [file, setFile] = useState<File | null>(null);
    const [isFree, setIsFree] = useState(false);

    // Upload state
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Quiz generation state
    const [quizStep, setQuizStep] = useState<'config' | 'generating' | 'preview'>('config');
    const [coursePdfs, setCoursePdfs] = useState<MaterialData[]>([]);
    const [loadingPdfs, setLoadingPdfs] = useState(false);
    const [selectedPdfUrls, setSelectedPdfUrls] = useState<string[]>([]);
    const [numQuestions, setNumQuestions] = useState(10);
    const [quizLanguage, setQuizLanguage] = useState<QuizLanguage>('french');
    const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(['mcq']);
    const [quizDifficulty, setQuizDifficulty] = useState<QuizDifficulty>('medium');
    const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[]>([]);

    // Fetch course PDFs whenever the quiz tab is selected
    useEffect(() => {
        if (type === 'quiz' && courseId && coursePdfs.length === 0 && !loadingPdfs) {
            setLoadingPdfs(true);
            getCourseMaterials(courseId)
                .then(mats => setCoursePdfs(mats.filter(m => m.type === 'pdf')))
                .catch(() => setError('Failed to load course PDFs'))
                .finally(() => setLoadingPdfs(false));
        }
    }, [type, courseId]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };


    const toggleQuestionType = (qt: QuestionType) => {
        setQuestionTypes(prev =>
            prev.includes(qt) ? prev.filter(t => t !== qt) : [...prev, qt]
        );
    };

    const togglePdfUrl = (url: string) => {
        setSelectedPdfUrls(prev =>
            prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
        );
    };

    const uploadFile = async (): Promise<string> => {
        if (!file) throw new Error('No file selected');
        if (!auth.currentUser) throw new Error('User not authenticated');

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


    const handleGenerateQuiz = async () => {
        setError(null);

        if (!title.trim()) {
            setError('Please enter a quiz title');
            return;
        }
        if (selectedPdfUrls.length === 0) {
            setError('Please select at least one PDF from your course library');
            return;
        }
        if (questionTypes.length === 0) {
            setError('Please select at least one question type');
            return;
        }

        setQuizStep('generating');

        try {
            const result = await generateQuiz(courseId, {
                title,
                numberOfQuestions: numQuestions,
                language: quizLanguage,
                questionTypes,
                difficulty: quizDifficulty,
                isFreePreview: isFree,
                pdfUrls: selectedPdfUrls,
            });

            setGeneratedQuiz(result.quiz);
            setQuizStep('preview');
        } catch (err: any) {
            console.error('Quiz generation failed:', err);
            setError(err.response?.data?.message || err.message || 'Failed to generate quiz');
            setQuizStep('config');
        }
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

            if (type === 'video' || type === 'pdf') {
                if (!file) {
                    setError('Please select a file to upload');
                    return;
                }
                finalContent = await uploadFile();
            }

            onSave({ type, title, url: finalContent, isFreePreview: isFree });
            handleClose();
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'Failed to upload material');
        }
    };

    const handleSaveQuiz = () => {
        // Quiz was already saved by the backend, just close
        handleClose();
        // Trigger a refresh of materials list
        onSave(null);
    };

    const handleClose = () => {
        onClose();
        setTitle('');
        setContent('');
        setFile(null);
        setIsFree(false);
        setProgress(0);
        setQuizStep('config');
        setSelectedPdfUrls([]);
        setCoursePdfs([]);
        setLoadingPdfs(false);
        setNumQuestions(10);
        setQuizLanguage('french');
        setQuestionTypes(['mcq']);
        setQuizDifficulty('medium');
        setGeneratedQuiz([]);
        setError(null);
    };

    const typeLabel = (qt: QuestionType) => {
        switch (qt) {
            case 'mcq': return 'MCQ';
            case 'true_false': return 'True / False';
            case 'fill_blank': return 'Fill in the Blanks';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-bold text-lg text-gray-900">
                        {type === 'quiz' && quizStep === 'preview' ? 'Quiz Preview' : 'Add New Material'}
                    </h3>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1">
                    {type === 'quiz' && quizStep === 'preview' ? (
                        /* ====== QUIZ PREVIEW ====== */
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                                <CheckCircle size={18} />
                                <span className="text-sm font-medium">Quiz generated successfully! {generatedQuiz.length} questions created.</span>
                            </div>

                            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                {generatedQuiz.map((q, i) => (
                                    <div key={q.id || i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">
                                                Q{i + 1}
                                            </span>
                                            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${q.type === 'mcq' ? 'bg-purple-100 text-purple-700' :
                                                q.type === 'true_false' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-teal-100 text-teal-700'
                                                }`}>
                                                {typeLabel(q.type)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-800 font-medium mb-2">{q.question}</p>
                                        {q.options && (
                                            <div className="space-y-1 mb-2">
                                                {q.options.map((opt, oi) => (
                                                    <div key={oi} className={`text-xs px-3 py-1.5 rounded-md ${opt === q.correctAnswer
                                                        ? 'bg-green-100 text-green-800 font-medium border border-green-200'
                                                        : 'bg-white text-gray-600 border border-gray-100'
                                                        }`}>
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {q.type === 'fill_blank' && (
                                            <p className="text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-md border border-green-100">
                                                Answer: {q.correctAnswer}
                                            </p>
                                        )}
                                        {q.explanation && (
                                            <p className="text-xs text-gray-500 mt-1 italic">💡 {q.explanation}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setQuizStep('config')}>Regenerate</Button>
                                <Button type="button" onClick={handleSaveQuiz}>
                                    Save Quiz
                                </Button>
                            </div>
                        </div>
                    ) : type === 'quiz' && quizStep === 'generating' ? (
                        /* ====== GENERATING STATE ====== */
                        <div className="p-6 flex flex-col items-center justify-center py-16 space-y-6">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-blue-300 animate-ping opacity-30"></div>
                            </div>
                            <div className="text-center">
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">Generating Quiz with AI...</h4>
                                <p className="text-sm text-gray-500">Analyzing PDFs and creating {numQuestions} questions</p>
                                <p className="text-xs text-gray-400 mt-2">This may take up to 30 seconds</p>
                            </div>
                        </div>
                    ) : (
                        /* ====== MAIN FORM ====== */
                        <form onSubmit={type !== 'quiz' ? handleSubmit : (e) => { e.preventDefault(); handleGenerateQuiz(); }} className="p-6 space-y-6">
                            {/* Material Type Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Material Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setType('video')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${type === 'video' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <Upload className="mb-2 w-5 h-5" />
                                        <span className="text-[10px] font-medium uppercase">Video Upload</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('pdf')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${type === 'pdf' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <FileText className="mb-2 w-5 h-5" />
                                        <span className="text-[10px] font-medium uppercase">PDF File</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('quiz')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${type === 'quiz' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <Sparkles className="mb-2 w-5 h-5" />
                                        <span className="text-[10px] font-medium uppercase">AI Quiz</span>
                                    </button>
                                </div>
                            </div>

                            {/* Title */}
                            <Input
                                label={type === 'quiz' ? 'Quiz Title' : 'Lesson Title'}
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder={type === 'quiz' ? 'e.g., Chapter 3 Review Quiz' : 'e.g., Introduction to Verbs'}
                                required
                            />

                            {/* Video / PDF Upload */}
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
                                            <button type="button" onClick={() => setFile(null)} className="p-1 hover:bg-blue-100 rounded-full text-blue-500 transition-colors">
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
                                                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ====== QUIZ CONFIG ====== */}
                            {type === 'quiz' && (
                                <div className="space-y-5">
                                    {/* PDF Selector from course library */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Source PDFs</label>
                                        <p className="text-xs text-gray-500 mb-3">Select PDFs from your course library for the AI to generate questions from.</p>

                                        {loadingPdfs ? (
                                            <div className="flex items-center justify-center py-8 text-gray-400">
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                <span className="text-sm">Loading course PDFs...</span>
                                            </div>
                                        ) : coursePdfs.length === 0 ? (
                                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50">
                                                <FileText className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                                <p className="text-sm font-medium text-gray-500">No PDFs in this course yet</p>
                                                <p className="text-xs text-gray-400 mt-1">Add a PDF material to the course first, then come back to generate a quiz.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {coursePdfs.map(pdf => {
                                                    const isSelected = selectedPdfUrls.includes(pdf.url);
                                                    return (
                                                        <button
                                                            key={pdf.id}
                                                            type="button"
                                                            onClick={() => togglePdfUrl(pdf.url)}
                                                            className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${isSelected
                                                                ? 'border-purple-400 bg-purple-50'
                                                                : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/30'
                                                                }`}
                                                        >
                                                            <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                                                                }`}>
                                                                {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                                            </div>
                                                            <FileText size={16} className={isSelected ? 'text-purple-600' : 'text-gray-400'} />
                                                            <span className={`text-sm font-medium truncate flex-1 ${isSelected ? 'text-purple-900' : 'text-gray-700'
                                                                }`}>
                                                                {pdf.title}
                                                            </span>
                                                            {isSelected && (
                                                                <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full flex-shrink-0">Selected</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Number of Questions */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Number of Questions: <span className="text-blue-600 font-bold">{numQuestions}</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="40"
                                            value={numQuestions}
                                            onChange={e => setNumQuestions(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>1</span>
                                            <span>20</span>
                                            <span>40</span>
                                        </div>
                                    </div>

                                    {/* Language */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Language</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setQuizLanguage('french')}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${quizLanguage === 'french'
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                                    }`}
                                            >
                                                🇫🇷 French
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setQuizLanguage('english')}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${quizLanguage === 'english'
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                                    }`}
                                            >
                                                🇬🇧 English
                                            </button>
                                        </div>
                                    </div>

                                    {/* Question Types */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Question Types</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {([
                                                { value: 'mcq' as QuestionType, label: 'MCQ', icon: '🔘' },
                                                { value: 'true_false' as QuestionType, label: 'True/False', icon: '✅' },
                                                { value: 'fill_blank' as QuestionType, label: 'Fill Blank', icon: '✏️' },
                                            ]).map(qt => (
                                                <button
                                                    key={qt.value}
                                                    type="button"
                                                    onClick={() => toggleQuestionType(qt.value)}
                                                    className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${questionTypes.includes(qt.value)
                                                        ? 'border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-200'
                                                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                                        }`}
                                                >
                                                    <span className="block text-base mb-1">{qt.icon}</span>
                                                    {qt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Difficulty */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {([
                                                { value: 'easy' as QuizDifficulty, label: 'Easy', color: 'green' },
                                                { value: 'medium' as QuizDifficulty, label: 'Medium', color: 'amber' },
                                                { value: 'hard' as QuizDifficulty, label: 'Hard', color: 'red' },
                                            ]).map(d => (
                                                <button
                                                    key={d.value}
                                                    type="button"
                                                    onClick={() => setQuizDifficulty(d.value)}
                                                    className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${quizDifficulty === d.value
                                                        ? `border-${d.color}-500 bg-${d.color}-50 text-${d.color}-700 ring-1 ring-${d.color}-200`
                                                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                                        }`}
                                                >
                                                    {d.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Free Preview Toggle */}
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

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="ghost" onClick={handleClose} disabled={uploading}>Cancel</Button>
                                {type === 'quiz' ? (
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-transparent"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate Quiz
                                    </Button>
                                ) : (
                                    <Button type="submit" isLoading={uploading}>
                                        {uploading ? 'Uploading...' : 'Save Material'}
                                    </Button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
