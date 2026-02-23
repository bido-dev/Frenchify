import React, { useState } from 'react';
import { CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from './Button';

export interface QuizQuestion {
    id: number;
    type: 'mcq' | 'true_false' | 'fill_blank';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation?: string;
}

interface QuizPlayerProps {
    title: string;
    questions: QuizQuestion[];
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ title, questions }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const currentQ = questions[currentIndex];
    const totalQuestions = questions.length;
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    const handleSelect = (answer: string) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [currentIndex]: answer }));
    };

    const handleFillBlank = (value: string) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [currentIndex]: value }));
    };

    const isCorrect = (index: number) => {
        const q = questions[index];
        const userAnswer = answers[index];
        if (!userAnswer) return false;
        return userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    };

    const getScore = () => {
        let correct = 0;
        questions.forEach((_, i) => {
            if (isCorrect(i)) correct++;
        });
        return correct;
    };

    const handleSubmitQuiz = () => {
        setSubmitted(true);
        setShowResults(true);
    };

    const handleRetry = () => {
        setAnswers({});
        setSubmitted(false);
        setShowResults(false);
        setCurrentIndex(0);
    };

    const answeredCount = Object.keys(answers).length;
    const allAnswered = answeredCount === totalQuestions;

    const typeLabel = (type: string) => {
        switch (type) {
            case 'mcq': return 'Multiple Choice';
            case 'true_false': return 'True or False';
            case 'fill_blank': return 'Fill in the Blank';
            default: return type;
        }
    };

    const typeColor = (type: string) => {
        switch (type) {
            case 'mcq': return 'bg-purple-100 text-purple-700';
            case 'true_false': return 'bg-amber-100 text-amber-700';
            case 'fill_blank': return 'bg-teal-100 text-teal-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Results Screen
    if (showResults) {
        const score = getScore();
        const percentage = Math.round((score / totalQuestions) * 100);
        const isGreat = percentage >= 80;
        const isOkay = percentage >= 50 && percentage < 80;

        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header gradient */}
                <div className={`px-6 py-8 text-center ${isGreat ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                        isOkay ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                            'bg-gradient-to-br from-red-500 to-rose-600'
                    }`}>
                    <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        {isGreat ? 'Excellent!' : isOkay ? 'Good effort!' : 'Keep practicing!'}
                    </h2>
                    <p className="text-white/80 text-sm">{title}</p>
                    <div className="mt-4">
                        <span className="text-5xl font-black text-white">{percentage}%</span>
                        <p className="text-white/70 text-sm mt-1">{score} / {totalQuestions} correct</p>
                    </div>
                </div>

                {/* Question Review */}
                <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                    {questions.map((q, i) => {
                        const correct = isCorrect(i);
                        const userAns = answers[i] || '(no answer)';
                        return (
                            <div key={i} className={`p-4 rounded-xl border-2 transition-all ${correct ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'
                                }`}>
                                <div className="flex items-start gap-3">
                                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${correct ? 'bg-emerald-500' : 'bg-red-500'
                                        }`}>
                                        {correct ? <CheckCircle className="w-4 h-4 text-white" /> : <XCircle className="w-4 h-4 text-white" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 mb-1">{q.question}</p>
                                        {!correct && (
                                            <div className="space-y-1 text-xs">
                                                <p className="text-red-600">Your answer: {userAns}</p>
                                                <p className="text-emerald-600 font-medium">Correct: {q.correctAnswer}</p>
                                            </div>
                                        )}
                                        {q.explanation && (
                                            <p className="text-xs text-gray-500 mt-1 italic">💡 {q.explanation}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-6 border-t border-gray-100">
                    <Button onClick={handleRetry} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-transparent">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // Quiz Player Screen
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-white/80" />
                        <h3 className="font-bold text-white text-sm truncate">{title}</h3>
                    </div>
                    <span className="text-xs text-white/70 font-medium flex-shrink-0">
                        {currentIndex + 1} / {totalQuestions}
                    </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-1.5">
                    <div
                        className="h-1.5 rounded-full bg-white transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Body */}
            <div className="p-6">
                <div className="mb-6">
                    <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-full mb-3 ${typeColor(currentQ.type)}`}>
                        {typeLabel(currentQ.type)}
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900 leading-relaxed">
                        {currentQ.question}
                    </h4>
                </div>

                {/* MCQ / True-False Options */}
                {(currentQ.type === 'mcq' || currentQ.type === 'true_false') && currentQ.options && (
                    <div className="space-y-2.5 mb-6">
                        {currentQ.options.map((opt, oi) => {
                            const isSelected = answers[currentIndex] === opt;
                            const isCorrectOpt = submitted && opt === currentQ.correctAnswer;
                            const isWrong = submitted && isSelected && !isCorrectOpt;

                            return (
                                <button
                                    key={oi}
                                    onClick={() => handleSelect(opt)}
                                    disabled={submitted}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${submitted
                                            ? isCorrectOpt
                                                ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                                                : isWrong
                                                    ? 'border-red-400 bg-red-50 text-red-800'
                                                    : 'border-gray-200 bg-gray-50 text-gray-500'
                                            : isSelected
                                                ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm ring-1 ring-blue-200'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${submitted
                                                ? isCorrectOpt
                                                    ? 'border-emerald-400 bg-emerald-500 text-white'
                                                    : isWrong
                                                        ? 'border-red-400 bg-red-500 text-white'
                                                        : 'border-gray-300 text-gray-400'
                                                : isSelected
                                                    ? 'border-blue-500 bg-blue-600 text-white'
                                                    : 'border-gray-300 text-gray-500'
                                            }`}>
                                            {submitted && isCorrectOpt ? <CheckCircle className="w-4 h-4" /> :
                                                submitted && isWrong ? <XCircle className="w-4 h-4" /> :
                                                    String.fromCharCode(65 + oi)}
                                        </div>
                                        <span className="font-medium text-sm">{opt}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Fill in the Blank */}
                {currentQ.type === 'fill_blank' && (
                    <div className="mb-6">
                        <input
                            type="text"
                            value={answers[currentIndex] || ''}
                            onChange={e => handleFillBlank(e.target.value)}
                            disabled={submitted}
                            placeholder="Type your answer here..."
                            className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${submitted
                                    ? isCorrect(currentIndex)
                                        ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                                        : 'border-red-400 bg-red-50 text-red-800'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                }`}
                        />
                        {submitted && !isCorrect(currentIndex) && (
                            <p className="mt-2 text-sm text-emerald-600 font-medium">
                                ✅ Correct answer: {currentQ.correctAnswer}
                            </p>
                        )}
                    </div>
                )}

                {/* Explanation (shown after submit) */}
                {submitted && currentQ.explanation && (
                    <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-800">💡 {currentQ.explanation}</p>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>

                    {currentIndex < totalQuestions - 1 ? (
                        <Button
                            size="sm"
                            onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                            disabled={!answers[currentIndex]}
                        >
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    ) : !submitted ? (
                        <Button
                            size="sm"
                            onClick={handleSubmitQuiz}
                            disabled={!allAnswered}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-transparent"
                        >
                            <CheckCircle className="w-4 h-4 mr-1" /> Submit Quiz
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() => setShowResults(true)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-transparent"
                        >
                            <Trophy className="w-4 h-4 mr-1" /> View Results
                        </Button>
                    )}
                </div>

                {/* Question dots */}
                <div className="flex justify-center gap-1.5 mt-4 flex-wrap">
                    {questions.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-3 h-3 rounded-full transition-all ${submitted
                                    ? isCorrect(i) ? 'bg-emerald-500' : answers[i] ? 'bg-red-400' : 'bg-gray-300'
                                    : i === currentIndex
                                        ? 'bg-blue-600 scale-125'
                                        : answers[i] ? 'bg-blue-300' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
