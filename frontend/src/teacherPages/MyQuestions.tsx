import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';
import { getUnansweredQuestions, answerQuestion, type QuestionData } from '../api/question.api';

export const MyQuestions: React.FC = () => {
    const [questions, setQuestions] = useState<QuestionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
    const [sendingReply, setSendingReply] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUnansweredQuestions();
            setQuestions(data);
        } catch (err: any) {
            console.error('Error fetching questions:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load questions.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleReplyChange = (id: string, text: string) => {
        setReplyText(prev => ({ ...prev, [id]: text }));
    };

    const handleSendReply = async (question: QuestionData) => {
        const reply = replyText[question.questionId]?.trim();
        if (!reply) return;

        setSendingReply(question.questionId);
        try {
            await answerQuestion(question.courseId, question.questionId, reply);
            // Remove from list since it's now answered
            setQuestions(prev => prev.filter(q => q.questionId !== question.questionId));
            setReplyText(prev => {
                const copy = { ...prev };
                delete copy[question.questionId];
                return copy;
            });
            setToast({ message: 'Reply sent successfully!', variant: 'success' });
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || 'Failed to send reply.', variant: 'error' });
        } finally {
            setSendingReply(null);
        }
    };

    const formatTimeAgo = (dateStr: string): string => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" text="Loading questions..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto py-12">
                <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-3" />
                    <h3 className="text-lg font-medium text-red-800">Failed to load questions</h3>
                    <p className="text-red-600 mt-1">{error}</p>
                    <Button onClick={fetchQuestions} className="mt-4">Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Student Questions</h1>
                    {questions.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <Clock size={14} /> {questions.length} pending
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {questions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <CheckCircle className="mx-auto h-12 w-12 text-emerald-400 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                        <p className="text-gray-500">No unanswered questions from your students.</p>
                    </div>
                ) : (
                    questions.map((q) => (
                        <div key={q.questionId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                    {q.userName?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">{q.userName}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                                                <span>{formatTimeAgo(q.createdAt)}</span>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <Clock size={12} /> Pending
                                        </span>
                                    </div>

                                    <div className="mt-3 p-4 bg-gray-50 rounded-lg text-gray-800 text-base leading-relaxed">
                                        "{q.content}"
                                    </div>

                                    {/* Reply Section */}
                                    <div className="mt-4 space-y-3">
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                                            placeholder="Write your reply here..."
                                            rows={3}
                                            value={replyText[q.questionId] || ''}
                                            onChange={(e) => handleReplyChange(q.questionId, e.target.value)}
                                            disabled={sendingReply === q.questionId}
                                        ></textarea>
                                        <div className="flex justify-end">
                                            <Button
                                                size="sm"
                                                onClick={() => handleSendReply(q)}
                                                disabled={!replyText[q.questionId]?.trim() || sendingReply === q.questionId}
                                                isLoading={sendingReply === q.questionId}
                                            >
                                                <Send size={14} className="mr-1" />
                                                Post Reply
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

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

export default MyQuestions;
