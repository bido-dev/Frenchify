import { Router } from "express";
import {
    createCourseHandler,
    addMaterial,
    publishCourse,
    updateCourseHandler,
    deleteCourseHandler,
    updateMaterialHandler,
    deleteMaterialHandler
} from "../controllers/course.controller";
import { isAuthenticated } from "../middleware/auth";
import { isTeacher } from "../middleware/roleCheck";

const router = Router();

// Apply "Teacher Guard" to all routes
router.use(isAuthenticated, isTeacher);

router.post("/", createCourseHandler); // [PRD 3.3]
router.patch("/:courseId", updateCourseHandler); // Update course
router.delete("/:courseId", deleteCourseHandler); // Delete course
router.post("/:courseId/materials", addMaterial); // [PRD 8]
router.patch("/:courseId/materials/:materialId", updateMaterialHandler); // Update material
router.delete("/:courseId/materials/:materialId", deleteMaterialHandler); // Delete material
router.patch("/:courseId/publish", publishCourse); // [PRD 6]

export default router;