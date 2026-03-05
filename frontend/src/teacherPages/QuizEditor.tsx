import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import {
    ArrowLeft, Plus, Trash2, GripVertical,
    CheckCircle, Save, PenLine
} from 'lucide-react';
import {
    addMaterial,
    updateMaterial,
    getCourseMaterials,
    type QuizQuestion,
    type QuestionType,
} from '../api/course.api';

interface QuizEditorQuestion extends QuizQuestion {
    _key: string; // local key for React rendering
}

const generateKey = () => Math.random().toString(36).substring(2, 10);

const createEmptyQuestion = (index: number): QuizEditorQuestion => ({
    _key: generateKey(),
    id: index + 1,
    type: 'mcq',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
});

export const QuizEditor: React.FC = () => {
    const { courseId, materialId } = useParams();
    const navigate = useNavigate();
    const isEditing = !!materialId;

    // Quiz metadata
    const [title, setTitle] = useState('');
    const [isFreePreview, setIsFreePreview] = useState(false);

    // Questions state
    const [questions, setQuestions] = useState<QuizEditorQuestion[]>([
        createEmptyQuestion(0),
    ]);

    // UI state
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

    // Load existing quiz data when editing
    useEffect(() => {
        if (isEditing && courseId && materialId) {
            const loadQuiz = async () => {
                try {
                    setLoading(true);
                    const materials = await getCourseMaterials(courseId);
                    const quizMaterial = materials.find(m => m.id === materialId);
                    if (!quizMaterial) {
                        setToast({ message: 'Quiz not found.', variant: 'error' });
                        return;
                    }
                    setTitle(quizMaterial.title);
                    setIsFreePreview(quizMaterial.isFreePreview);

                    // Parse quiz data from the url field (stored as JSON string)
                    const quizData: QuizQuestion[] = JSON.parse(quizMaterial.url);
                    setQuestions(
                        quizData.map((q, i) => ({
                            ...q,
                            _key: generateKey(),
                            id: i + 1,
                            options: q.options || (q.type === 'true_false' ? ['True', 'False'] : ['']),
                            explanation: q.explanation || '',
                        }))
                    );
                } catch (err: any) {
                    console.error('Error loading quiz:', err);
                    setToast({ message: 'Failed to load quiz data.', variant: 'error' });
                } finally {
                    setLoading(false);
                }
            };
            loadQuiz();
        }
    }, [courseId, materialId, isEditing]);

    // --- Question management handlers ---

    const addQuestion = () => {
        setQuestions(prev => [...prev, createEmptyQuestion(prev.length)]);
    };

    const removeQuestion = (key: string) => {
        setQuestions(prev => prev.filter(q => q._key !== key).map((q, i) => ({ ...q, id: i + 1 })));
    };

    const updateQuestion = (key: string, field: keyof QuizEditorQuestion, value: any) => {
        setQuestions(prev =>
            prev.map(q => {
                if (q._key !== key) return q;
                const updated = { ...q, [field]: value };

                // When changing type, reset options and correctAnswer
                if (field === 'type') {
                    const newType = value as QuestionType;
                    if (newType === 'mcq') {
                        updated.options = ['', '', '', ''];
                        updated.correctAnswer = '';
                    } else if (newType === 'true_false') {
                        updated.options = ['True', 'False'];
                        updated.correctAnswer = '';
                    } else {
                        updated.options = undefined;
                        updated.correctAnswer = '';
                    }
                }
                return updated;
            })
        );
    };

    const updateOption = (key: string, optionIndex: number, value: string) => {
        setQuestions(prev =>
            prev.map(q => {
                if (q._key !== key || !q.options) return q;
                const newOptions = [...q.options];
                newOptions[optionIndex] = value;
                return { ...q, options: newOptions };
            })
        );
    };

    const addOption = (key: string) => {
        setQuestions(prev =>
            prev.map(q => {
                if (q._key !== key || !q.options) return q;
                return { ...q, options: [...q.options, ''] };
            })
        );
    };

    const removeOption = (key: string, optionIndex: number) => {
        setQuestions(prev =>
            prev.map(q => {
                if (q._key !== key || !q.options || q.options.length <= 2) return q;
                const newOptions = q.options.filter((_, i) => i !== optionIndex);
                const removedValue = q.options[optionIndex];
                return {
                    ...q,
                    options: newOptions,
                    correctAnswer: q.correctAnswer === removedValue ? '' : q.correctAnswer,
                };
            })
        );
    };

    // --- Validation ---
    const validate = (): string | null => {
        if (!title.trim()) return 'Please enter a quiz title.';
        if (questions.length === 0) return 'Add at least one question.';

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question.trim()) return `Question ${i + 1}: Please enter the question text.`;
            if (!q.correctAnswer.trim()) return `Question ${i + 1}: Please set the correct answer.`;

            if (q.type === 'mcq' && q.options) {
                const emptyOpt = q.options.findIndex(o => !o.trim());
                if (emptyOpt !== -1) return `Question ${i + 1}: Option ${emptyOpt + 1} is empty.`;
                if (!q.options.includes(q.correctAnswer)) return `Question ${i + 1}: Correct answer must match one of the options.`;
            }
            if (q.type === 'true_false') {
                if (q.correctAnswer !== 'True' && q.correctAnswer !== 'False') {
                    return `Question ${i + 1}: Correct answer must be "True" or "False".`;
                }
            }
        }
        return null;
    };

    // --- Save ---
    const handleSave = async () => {
        const validationError = validate();
        if (validationError) {
            setToast({ message: validationError, variant: 'error' });
            return;
        }

        setSaving(true);
        try {
            // Strip internal _key before saving
            const quizPayload: QuizQuestion[] = questions.map(({ _key, ...rest }) => rest);
            const quizJson = JSON.stringify(quizPayload);

            if (isEditing && materialId) {
                await updateMaterial(courseId!, materialId, {
                    title,
                    url: quizJson,
                    isFreePreview,
                });
                setToast({ message: 'Quiz updated successfully!', variant: 'success' });
            } else {
                await addMaterial(courseId!, {
                    title,
                    type: 'quiz',
                    url: quizJson,
                    isFreePreview,
                });
                setToast({ message: 'Quiz created successfully!', variant: 'success' });
            }

            // Navigate back after short delay
            setTimeout(() => {
                navigate(`/teacher/course/${courseId}/edit`);
            }, 1000);
        } catch (err: any) {
            console.error('Save error:', err);
            setToast({ message: err.response?.data?.message || 'Failed to save quiz.', variant: 'error' });
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" text="Loading quiz..." />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="pl-0 hover:bg-transparent"
                        onClick={() => navigate(`/teacher/course/${courseId}/edit`)}
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" /> Back
                    </Button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {isEditing ? 'Edit Quiz' : 'Create Quiz'}
                    </h1>
                </div>
                <Button onClick={handleSave} isLoading={saving} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Update Quiz' : 'Save Quiz'}
                </Button>
            </div>

            {/* Quiz Metadata Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4">
                <Input
                    label="Quiz Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Chapter 3 Review Quiz"
                    required
                />
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                        type="checkbox"
                        id="quiz-free-preview"
                        checked={isFreePreview}
                        onChange={e => setIsFreePreview(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="quiz-free-preview" className="text-sm font-medium text-gray-700">
                        Enable Free Preview
                        <span className="block text-xs text-gray-500 font-normal">Allow free tier users to access this quiz</span>
                    </label>
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        Questions <span className="text-sm font-normal text-gray-500">({questions.length})</span>
                    </h2>
                    <Button size="sm" variant="secondary" onClick={addQuestion}>
                        <Plus className="w-4 h-4 mr-1" /> Add Question
                    </Button>
                </div>

                {questions.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <PenLine className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No questions yet</p>
                        <p className="text-gray-400 text-sm mt-1">Click "Add Question" to get started</p>
                    </div>
                )}

                {questions.map((q, qi) => (
                    <div key={q._key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Question Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-gray-400 hidden sm:block" />
                                <span className="text-xs font-bold text-white bg-blue-600 px-2.5 py-0.5 rounded-full">
                                    Q{qi + 1}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Type Selector */}
                                <select
                                    value={q.type}
                                    onChange={e => updateQuestion(q._key, 'type', e.target.value)}
                                    className="text-xs sm:text-sm font-medium border border-gray-200 rounded-lg px-2 py-1 bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none cursor-pointer"
                                >
                                    <option value="mcq">Multiple Choice</option>
                                    <option value="true_false">True / False</option>
                                    <option value="fill_blank">Fill in the Blank</option>
                                </select>
                                <button
                                    onClick={() => removeQuestion(q._key)}
                                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove question"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Question Body */}
                        <div className="p-4 sm:p-6 space-y-4">
                            {/* Question Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                <textarea
                                    value={q.question}
                                    onChange={e => updateQuestion(q._key, 'question', e.target.value)}
                                    placeholder="Enter your question here..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 min-h-[80px] text-sm resize-y"
                                    rows={2}
                                />
                            </div>

                            {/* MCQ Options */}
                            {q.type === 'mcq' && q.options && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                                    <div className="space-y-2">
                                        {q.options.map((opt, oi) => (
                                            <div key={oi} className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuestion(q._key, 'correctAnswer', opt)}
                                                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${q.correctAnswer === opt && opt.trim()
                                                        ? 'border-green-500 bg-green-500'
                                                        : 'border-gray-300 hover:border-green-400'
                                                        }`}
                                                    title="Mark as correct answer"
                                                >
                                                    {q.correctAnswer === opt && opt.trim() && (
                                                        <CheckCircle className="w-3 h-3 text-white" />
                                                    )}
                                                </button>
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={e => {
                                                        // If this option was the correct answer, update it
                                                        if (q.correctAnswer === opt) {
                                                            updateQuestion(q._key, 'correctAnswer', e.target.value);
                                                        }
                                                        updateOption(q._key, oi, e.target.value);
                                                    }}
                                                    placeholder={`Option ${oi + 1}`}
                                                    className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${q.correctAnswer === opt && opt.trim()
                                                        ? 'border-green-300 bg-green-50'
                                                        : 'border-gray-300'
                                                        }`}
                                                />
                                                {q.options!.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOption(q._key, oi)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => addOption(q._key)}
                                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Option
                                    </button>
                                    <p className="text-xs text-gray-400 mt-1">Click the circle next to an option to mark it as the correct answer.</p>
                                </div>
                            )}

                            {/* True/False */}
                            {q.type === 'true_false' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                                    <div className="flex gap-3">
                                        {['True', 'False'].map(val => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => updateQuestion(q._key, 'correctAnswer', val)}
                                                className={`flex-1 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${q.correctAnswer === val
                                                    ? val === 'True'
                                                        ? 'border-green-500 bg-green-50 text-green-700 ring-1 ring-green-200'
                                                        : 'border-red-500 bg-red-50 text-red-700 ring-1 ring-red-200'
                                                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Fill in the Blank */}
                            {q.type === 'fill_blank' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                                    <input
                                        type="text"
                                        value={q.correctAnswer}
                                        onChange={e => updateQuestion(q._key, 'correctAnswer', e.target.value)}
                                        placeholder="Enter the correct answer..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                    />
                                </div>
                            )}

                            {/* Explanation (optional) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Explanation <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={q.explanation || ''}
                                    onChange={e => updateQuestion(q._key, 'explanation', e.target.value)}
                                    placeholder="Explain why this is the correct answer..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Add + Save */}
            {questions.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                    <Button variant="secondary" onClick={addQuestion}>
                        <Plus className="w-4 h-4 mr-1" /> Add Question
                    </Button>
                    <Button onClick={handleSave} isLoading={saving} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isEditing ? 'Update Quiz' : 'Save Quiz'}
                    </Button>
                </div>
            )}

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

export default QuizEditor;
