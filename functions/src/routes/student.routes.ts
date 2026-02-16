import { Router } from "express";
import {
    getCourses,
    getCourseById_Handler,
    getCourseMaterials,
    getStats,
    getEnrolledCourses
} from "../controllers/student.controller";
import { getCourseLessonsHandler } from "../controllers/lesson.controller";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

// Public: Browse course catalog
router.get("/courses", getCourses);

// Public: Get course details
router.get("/courses/:id", getCourseById_Handler);

// Public: Get course lessons
router.get("/courses/:courseId/lessons", getCourseLessonsHandler);

// Authenticated: Get materials (tier enforcement happens in controller)
router.get("/courses/:id/materials", isAuthenticated, getCourseMaterials);

// Authenticated: Get student statistics
router.get("/stats", isAuthenticated, getStats);

// Authenticated: Get enrolled courses
router.get("/enrolled", isAuthenticated, getEnrolledCourses);

export default router;

