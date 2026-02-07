import { Router } from "express";
import { syncUser, getProfile } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

// Public: Called immediately after Firebase Auth Signup
router.post("/sync", syncUser);

// Protected: Get own profile
router.get("/me", isAuthenticated, getProfile);

export default router;