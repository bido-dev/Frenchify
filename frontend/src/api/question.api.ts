import api from './index';

/**
 * Question API - Endpoints for teacher Q&A management
 */

export interface QuestionData {
    questionId: string;
    courseId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
    isAnswered: boolean;
    answerText?: string;
    answeredAt?: string;
}

/** Get unanswered questions for the teacher's courses */
export const getUnansweredQuestions = async (): Promise<QuestionData[]> => {
    const response = await api.get('/questions/teacher/unanswered');
    return response.data;
};

/** Answer a student question */
export const answerQuestion = async (courseId: string, questionId: string, answerText: string): Promise<void> => {
    await api.patch(`/questions/${courseId}/${questionId}/answer`, { answerText });
};
