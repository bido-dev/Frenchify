import { Router } from "express";
import {
    createCourseHandler,
    addMaterial,
    publishCourse,
    updateCourseHandler,
    deleteCourseHandler,
    updateMaterialHandler,
    deleteMaterialHandler,
    getCourseMaterialsHandler
} from "../controllers/course.controller";
import { generateQuiz } from "../controllers/quiz.controller";
import {
    createLessonHandler,
    updateLessonHandler,
    deleteLessonHandler,
    getCourseLessonsHandler
} from "../controllers/lesson.controller";
import { isAuthenticated } from "../middleware/auth";
import { isTeacher } from "../middleware/roleCheck";

const router = Router();

// Apply "Teacher Guard" to all routes
router.use(isAuthenticated, isTeacher);

router.post("/", createCourseHandler); // [PRD 3.3]
router.patch("/:courseId", updateCourseHandler); // Update course
router.delete("/:courseId", deleteCourseHandler); // Delete course
router.get("/:courseId/materials", getCourseMaterialsHandler); // Get all materials (owner only)
router.post("/:courseId/materials", addMaterial); // [PRD 8]
router.post("/:courseId/materials/generate-quiz", generateQuiz); // Generate AI Quiz
router.patch("/:courseId/materials/:materialId", updateMaterialHandler); // Update material
router.delete("/:courseId/materials/:materialId", deleteMaterialHandler); // Delete material
router.patch("/:courseId/publish", publishCourse); // [PRD 6]

// Lesson Routes
router.post("/:courseId/lessons", createLessonHandler);
router.get("/:courseId/lessons", getCourseLessonsHandler);
router.patch("/:courseId/lessons/:lessonId", updateLessonHandler);
router.delete("/:courseId/lessons/:lessonId", deleteLessonHandler);

export default router;