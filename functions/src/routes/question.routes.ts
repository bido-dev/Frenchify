import { Router } from "express";
import { askQuestion, getQuestions, answerQuestionHandler, getTeacherUnansweredQuestions, getStudentQuestionsHandler } from "../controllers/question.controller";
import { isAuthenticated } from "../middleware/auth";
import { isPaidTier, isTeacher } from "../middleware/roleCheck";

const router = Router();

// Student gets their own questions
router.get("/student/my", isAuthenticated, getStudentQuestionsHandler);

// Teacher gets their unanswered questions (Teacher dashboard)
router.get("/teacher/unanswered", isAuthenticated, isTeacher, getTeacherUnansweredQuestions);

// Student posts a question (Paid tier only per PRD 3.2)
router.post("/:courseId", isAuthenticated, isPaidTier, askQuestion);

// Get all questions for a course (Public or authenticated - depends on your needs)
router.get("/:courseId", getQuestions);

// Teacher answers a question (Teacher/Admin only)
router.patch("/:courseId/:questionId/answer", isAuthenticated, isTeacher, answerQuestionHandler);

// Teacher gets their unanswered questions (Teacher dashboard)
router.get("/teacher/unanswered", isAuthenticated, isTeacher, getTeacherUnansweredQuestions);

export default router;
