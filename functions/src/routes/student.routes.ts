import { Router } from "express";
import { getCourses, getCourseById_Handler, getCourseMaterials } from "../controllers/student.controller";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

// Public: Browse course catalog
router.get("/courses", getCourses);

// Public: Get course details
router.get("/courses/:id", getCourseById_Handler);

// Authenticated: Get materials (tier enforcement happens in controller)
router.get("/courses/:id/materials", isAuthenticated, getCourseMaterials);

export default router;
