import { db } from "../config/firebase";

/**
 * Question Model - Database operations for Q&A system
 * All functions are pure database operations with no HTTP logic
 */

export interface QuestionData {
    questionId: string;
    courseId: string;
    userId: string;
    userName: string; // Cached for display
    content: string;
    createdAt: string;
    isAnswered: boolean;
    answerText?: string;
    answeredAt?: string;
}

/**
 * Create a new question in a course's questions subcollection
 * @param courseId - Course document ID
 * @param userId - Student's UID
 * @param userName - Student's name (cached)
 * @param content - Question text
 * @returns Question document ID
 */
export const createQuestion = async (
    courseId: string,
    userId: string,
    userName: string,
    content: string
): Promise<string> => {
    const newQuestion = {
        courseId,
        userId,
        userName,
        content,
        createdAt: new Date().toISOString(),
        isAnswered: false
    };

    const docRef = await db
        .collection("courses")
        .doc(courseId)
        .collection("questions")
        .add(newQuestion);

    return docRef.id;
};

/**
 * Get all questions for a specific course
 * @param courseId - Course document ID
 * @returns Array of questions
 */
export const getQuestionsByCourse = async (
    courseId: string
): Promise<QuestionData[]> => {
    const snapshot = await db
        .collection("courses")
        .doc(courseId)
        .collection("questions")
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map(doc => ({
        questionId: doc.id,
        ...doc.data()
    } as QuestionData));
};

/**
 * Get all unanswered questions for a teacher's courses
 * @param teacherId - Teacher's UID
 * @returns Array of unanswered questions with course info
 */
export const getUnansweredQuestions = async (
    teacherId: string
): Promise<QuestionData[]> => {
    // First, get all courses owned by this teacher
    const coursesSnapshot = await db
        .collection("courses")
        .where("teacherId", "==", teacherId)
        .get();

    const unansweredQuestions: QuestionData[] = [];

    // For each course, get unanswered questions
    for (const courseDoc of coursesSnapshot.docs) {
        const questionsSnapshot = await db
            .collection("courses")
            .doc(courseDoc.id)
            .collection("questions")
            .where("isAnswered", "==", false)
            .orderBy("createdAt", "desc")
            .get();

        questionsSnapshot.forEach(questionDoc => {
            unansweredQuestions.push({
                questionId: questionDoc.id,
                courseId: courseDoc.id,
                ...questionDoc.data()
            } as QuestionData);
        });
    }

    return unansweredQuestions;
};

/**
 * Answer a question (teacher replies)
 * @param courseId - Course document ID
 * @param questionId - Question document ID
 * @param answerText - Teacher's answer
 * @returns Promise<void>
 */
export const answerQuestion = async (
    courseId: string,
    questionId: string,
    answerText: string
): Promise<void> => {
    await db
        .collection("courses")
        .doc(courseId)
        .collection("questions")
        .doc(questionId)
        .update({
            answerText,
            isAnswered: true,
            answeredAt: new Date().toISOString()
        });
};

/**
 * Get a single question by ID
 * @param courseId - Course document ID
 * @param questionId - Question document ID
 * @returns Question data or null if not found
 */
export const getQuestionById = async (
    courseId: string,
    questionId: string
): Promise<QuestionData | null> => {
    const questionDoc = await db
        .collection("courses")
        .doc(courseId)
        .collection("questions")
        .doc(questionId)
        .get();

    if (!questionDoc.exists) {
        return null;
    }

    return {
        questionId: questionDoc.id,
        courseId,
        ...questionDoc.data()
    } as QuestionData;
};

/**
 * Get all questions asked by a specific student across all courses
 * @param studentId - Student's UID
 * @returns Array of questions with course info
 */
export const getStudentQuestions = async (
    studentId: string
): Promise<QuestionData[]> => {
    const questionsSnapshot = await db
        .collectionGroup("questions")
        .where("userId", "==", studentId)
        .orderBy("createdAt", "desc")
        .get();

    return questionsSnapshot.docs.map(doc => ({
        questionId: doc.id,
        ...doc.data()
    } as QuestionData));
};
