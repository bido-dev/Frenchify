import { Router } from "express";
import {
    handleTeacherApproval,
    manageSubscription,
    deleteUser,
    createAdminUser,
    getPendingTeachers,
    getAllUsers
} from "../controllers/admin.controller";
import { isAuthenticated } from "../middleware/auth";
import { isAdmin } from "../middleware/roleCheck";

const router = Router();

// Apply "Security Guards" to all routes in this file
router.use(isAuthenticated, isAdmin);

router.get("/users", getAllUsers); // [PRD 3.4]
router.get("/pending-teachers", getPendingTeachers); // [PRD 3.4]
router.post("/approve-teacher", handleTeacherApproval); // [PRD 3.4]
router.post("/manage-subscription", manageSubscription); // [PRD 9.C]
router.delete("/users/:uid", deleteUser);
router.post("/create-admin", createAdminUser); // [PRD 3.4] Create another admin

export default router;