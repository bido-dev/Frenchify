import { Router } from "express";
import { getStats, getCourses } from "../controllers/teacher.controller";
import { isAuthenticated } from "../middleware/auth";
import { isTeacher } from "../middleware/roleCheck";

const router = Router();

// Teacher routes - all require authentication and teacher role

// Get teacher statistics
router.get("/stats", isAuthenticated, isTeacher, getStats);

// Get teacher's courses with stats
router.get("/courses", isAuthenticated, isTeacher, getCourses);

export default router;
