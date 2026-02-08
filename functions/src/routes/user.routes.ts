import { Router } from "express";
import { syncUser, getProfile, reapplyTeacher } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

// Public: Called immediately after Firebase Auth Signup
router.post("/sync", syncUser);

// Protected: Get own profile
router.get("/me", isAuthenticated, getProfile);

// Protected: Reapply for teacher account (rejected → pending)
router.post("/reapply", isAuthenticated, reapplyTeacher);

export default router;