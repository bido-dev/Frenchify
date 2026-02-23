import React, { useState, useEffect } from 'react';
import { getMyQuestions, type Question } from '../api/student.api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CheckCircle, Clock } from 'lucide-react';

export default function MyQuestions() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getMyQuestions();
                setQuestions(data);
            } catch (error) {
                console.error("Failed to fetch questions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    if (loading) {
        return <div className="flex justify-center py-12"><LoadingSpinner size="lg" text="Loading questions..." /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Questions</h1>

            {questions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                    <p>You haven't asked any questions yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {questions.map((q) => (
                        <div key={q.questionId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${q.isAnswered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {q.isAnswered ? (
                                                <><CheckCircle className="w-3 h-3 mr-1" /> Answered</>
                                            ) : (
                                                <><Clock className="w-3 h-3 mr-1" /> Pending</>
                                            )}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(q.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-900 font-medium whitespace-pre-wrap mb-4">{q.content}</p>

                                {q.isAnswered && q.answerText && (
                                    <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <p className="text-sm font-bold text-gray-700 mb-2">Teacher's Answer:</p>
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{q.answerText}</p>
                                        {q.answeredAt && (
                                            <p className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-200">
                                                Answered on {new Date(q.answeredAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
