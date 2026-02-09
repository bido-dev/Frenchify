import { Request, Response } from "express";
import {
    updateTeacherStatus,
    updateUserSubscription,
    deleteUserAccount,
    createAdmin,
    getPendingTeachers as getPendingTeachersModel,
    getAllUsers as getAllUsersModel
} from "../models/admin.model";

// 0. Get Pending Teachers [PRD 3.4, 9.C]
export const getPendingTeachers = async (req: Request, res: Response) => {
    try {
        const pendingTeachers = await getPendingTeachersModel();
        res.status(200).send(pendingTeachers);
    } catch (error) {
        console.error("Error fetching pending teachers:", error);
        res.status(500).send({ message: "Error fetching pending teachers" });
    }
};

// 0.1. Get All Users [PRD 3.4]
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsersModel();
        res.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Error fetching users" });
    }
};

// 1. Approve or Reject Teacher [PRD 3.4, 9.C]
export const handleTeacherApproval = async (req: Request, res: Response) => {
    try {
        const { uid, action } = req.body; // action: 'approve' | 'reject'

        if (!uid || !['approve', 'reject'].includes(action)) {
            res.status(400).send({ message: "Invalid request" });
            return;
        }

        const status = action === 'approve' ? 'active' : 'rejected';

        // Use model layer for database operation
        await updateTeacherStatus(uid, status);

        res.status(200).send({ message: `Teacher ${action}ed successfully` });
    } catch (error) {
        res.status(500).send({ message: "Error updating teacher status" });
    }
};

// 2. Manage User Subscription (Manual Override) [PRD 3.4, 9.C]
export const manageSubscription = async (req: Request, res: Response) => {
    try {
        const { uid, tier } = req.body; // tier: 'free' | 'paid'

        if (!uid || !['free', 'paid'].includes(tier)) {
            res.status(400).send({ message: "Invalid tier" });
            return;
        }

        // Use model layer for database operation
        await updateUserSubscription(uid, tier);

        res.status(200).send({ message: `User upgraded to ${tier}` });
    } catch (error) {
        res.status(500).send({ message: "Error updating subscription" });
    }
};

// 3. Delete User (Cleanup) [PRD 3.4, 9.C]
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params as { uid: string };

        // Import db for user lookup
        const { db } = await import("../config/firebase.js");

        // Prevent deletion of admin users
        const userDoc = await db.collection("users").doc(uid).get();
        if (!userDoc.exists) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        const userData = userDoc.data();
        if (userData?.role === "admin") {
            res.status(403).send({ message: "Cannot delete admin users" });
            return;
        }

        // Use model layer for database operation (handles both Auth and DB)
        await deleteUserAccount(uid);

        res.status(200).send({
            message: "User deleted permanently",
            role: userData?.role
        });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        res.status(500).send({
            message: error.message || "Error deleting user"
        });
    }
};

// 4. Create Another Admin (Admin-only per PRD 3.4)
export const createAdminUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            res.status(400).send({ message: "Email and password are required" });
            return;
        }

        // Use model layer for database operation
        const adminUid = await createAdmin(email, password, name);

        res.status(201).send({
            uid: adminUid,
            message: "Admin user created successfully"
        });
    } catch (error: any) {
        console.error("Error creating admin:", error);

        // Handle Firebase Auth errors
        if (error.code === "auth/email-already-exists") {
            res.status(400).send({ message: "Email already exists" });
            return;
        }

        res.status(500).send({ message: "Error creating admin user" });
    }
};
