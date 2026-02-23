import { Request, Response } from "express";
import { createQuestion, getQuestionsByCourse, answerQuestion, getUnansweredQuestions, getStudentQuestions } from "../models/question.model";
import { checkCourseOwnership } from "../models/course.model";
import { getUserById } from "../models/user.model";

/**
 * Student asks a question on a course (Paid tier only per PRD 3.2)
 * POST /questions/:courseId
 */
export const askQuestion = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };
        const { content } = req.body;
        const uid = req.user?.uid;

        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        if (!content || content.trim().length === 0) {
            res.status(400).send({ message: "Question content is required" });
            return;
        }

        // Get user data for caching userName
        const user = await getUserById(uid);
        const userName = user?.email || "Anonymous";

        // Use model layer for database operation
        const questionId = await createQuestion(courseId, uid, userName, content);

        res.status(201).send({
            id: questionId,
            message: "Question posted successfully"
        });
    } catch (error) {
        console.error("Error posting question:", error);
        res.status(500).send({ message: "Error posting question" });
    }
};

/**
 * Get all questions for a course
 * GET /questions/:courseId
 */
export const getQuestions = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };

        // Use model layer for database operation
        const questions = await getQuestionsByCourse(courseId);

        res.status(200).send(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).send({ message: "Error fetching questions" });
    }
};

/**
 * Teacher answers a question (ownership check required)
 * PATCH /questions/:courseId/:questionId/answer
 */
export const answerQuestionHandler = async (req: Request, res: Response) => {
    try {
        const { courseId, questionId } = req.params as { courseId: string; questionId: string };
        const { answerText } = req.body;
        const uid = req.user?.uid;

        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        if (!answerText || answerText.trim().length === 0) {
            res.status(400).send({ message: "Answer text is required" });
            return;
        }

        // Use model layer to verify ownership
        const isOwner = await checkCourseOwnership(courseId, uid);
        const isAdmin = req.user?.role === "admin";

        if (!isOwner && !isAdmin) {
            res.status(403).send({ message: "Forbidden: Not your course" });
            return;
        }

        // Use model layer for database operation
        await answerQuestion(courseId, questionId, answerText);

        res.status(200).send({ message: "Question answered successfully" });
    } catch (error) {
        console.error("Error answering question:", error);
        res.status(500).send({ message: "Error answering question" });
    }
};

/**
 * Get unanswered questions for teacher's courses
 * GET /questions/teacher/unanswered
 */
export const getTeacherUnansweredQuestions = async (req: Request, res: Response) => {
    try {
        const uid = req.user?.uid;

        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        // Use model layer for database operation
        const questions = await getUnansweredQuestions(uid);

        res.status(200).send(questions);
    } catch (error) {
        console.error("Error fetching unanswered questions:", error);
        res.status(500).send({ message: "Error fetching unanswered questions" });
    }
};

/**
 * Get all questions asked by a specific student
 * GET /questions/student/my
 */
export const getStudentQuestionsHandler = async (req: Request, res: Response) => {
    try {
        const uid = req.user?.uid;

        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        // Use model layer for database operation
        const questions = await getStudentQuestions(uid);

        res.status(200).send(questions);
    } catch (error) {
        console.error("Error fetching student questions:", error);
        res.status(500).send({ message: "Error fetching student questions" });
    }
};
