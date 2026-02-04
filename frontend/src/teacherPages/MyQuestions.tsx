import React, { useState } from 'react';
import { Button } from '../components/Button';
import { MessageCircle, CheckCircle, Clock } from 'lucide-react';

// Mock Data
const MOCK_QUESTIONS = [
    {
        id: 1,
        studentName: 'Alice Johnson',
        courseTitle: 'French Grammar 101',
        lessonTitle: 'Verbs - Present Tense',
        question: 'Could you explain the difference between "avoir" and "être" again? I am a bit confused.',
        timestamp: '2 hours ago',
        status: 'unanswered',
        avatar: 'https://i.pravatar.cc/150?u=alice'
    },
    {
        id: 2,
        studentName: 'Bob Smith',
        courseTitle: 'Business French',
        lessonTitle: 'Email Etiquette',
        question: 'Is "Cordialement" appropriate for a CEO?',
        timestamp: '1 day ago',
        status: 'answered',
        avatar: 'https://i.pravatar.cc/150?u=bob',
        reply: 'Yes, "Cordialement" is standard and safe. For a closer relationship, you might use "Bien à vous".'
    },
    {
        id: 3,
        studentName: 'Charlie Brown',
        courseTitle: 'French Grammar 101',
        lessonTitle: 'Introduction',
        question: 'Will we cover the subjunctive mood in this course?',
        timestamp: '2 days ago',
        status: 'unanswered',
        avatar: 'https://i.pravatar.cc/150?u=charlie'
    }
];

export const MyQuestions: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'unanswered' | 'answered'>('all');
    const [replyText, setReplyText] = useState<{ [key: number]: string }>({});

    const filteredQuestions = MOCK_QUESTIONS.filter(q => {
        if (filter === 'all') return true;
        return q.status === filter;
    });

    const handleReplyChange = (id: number, text: string) => {
        setReplyText(prev => ({ ...prev, [id]: text }));
    };

    const handleSendReply = (id: number) => {
        // Simulate sending reply
        console.log(`Replying to ${id}: ${replyText[id]}`);
        alert('Reply sent! (Simulation)');
        setReplyText(prev => ({ ...prev, [id]: '' }));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Student Questions</h1>
                </div>
            </div>

            <div className="flex gap-4 border-b border-gray-200 pb-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    All Questions
                </button>
                <button
                    onClick={() => setFilter('unanswered')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'unanswered' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Unanswered
                </button>
                <button
                    onClick={() => setFilter('answered')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'answered' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Answered
                </button>
            </div>

            <div className="space-y-4">
                {filteredQuestions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No questions found</h3>
                        <p className="text-gray-500">Good job! You're all caught up.</p>
                    </div>
                ) : (
                    filteredQuestions.map((q) => (
                        <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
                            <div className="flex items-start gap-4">
                                <img
                                    src={q.avatar}
                                    alt={q.studentName}
                                    className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">{q.studentName}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                                                <span>{q.courseTitle}</span>
                                                <span>•</span>
                                                <span>{q.lessonTitle}</span>
                                                <span>•</span>
                                                <span>{q.timestamp}</span>
                                            </div>
                                        </div>
                                        <div>
                                            {q.status === 'answered' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    <CheckCircle size={12} /> Answered
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    <Clock size={12} /> Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3 p-4 bg-gray-50 rounded-lg text-gray-800 text-base leading-relaxed">
                                        "{q.question}"
                                    </div>

                                    {/* Reply Section */}
                                    <div className="mt-4">
                                        {q.status === 'answered' ? (
                                            <div className="pl-4 border-l-2 border-emerald-200">
                                                <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Your Answer</p>
                                                <p className="text-gray-700">{q.reply}</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                                                    placeholder="Write your reply here..."
                                                    rows={3}
                                                    value={replyText[q.id] || ''}
                                                    onChange={(e) => handleReplyChange(q.id, e.target.value)}
                                                ></textarea>
                                                <div className="flex justify-end">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSendReply(q.id)}
                                                        disabled={!replyText[q.id]}
                                                    >
                                                        Post Reply
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyQuestions;
