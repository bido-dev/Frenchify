import { Request, Response } from "express";
import { createOrUpdateUser, getUserById, updateUserStatus } from "../models/user.model";

// 1. Create/Sync User (Called after Signup)
export const syncUser = async (req: Request, res: Response) => {
    try {
        const { uid, email, role, name } = req.body;

        if (!uid || !email) {
            res.status(400).send({ message: "Missing fields" });
            return;
        }

        // Use model layer for database operation
        await createOrUpdateUser(uid, email, role, name);

        // Fetch and return the created user data
        const user = await getUserById(uid);

        if (!user) {
            res.status(500).send({ message: "User created but failed to fetch" });
            return;
        }

        res.status(201).send(user);
    } catch (error) {
        res.status(500).send({ message: "Error syncing user", error });
    }
};

// 2. Get Own Profile
export const getProfile = async (req: Request, res: Response) => {
    try {
        const uid = req.user?.uid; // From Auth Middleware
        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        // Use model layer for database operation
        const user = await getUserById(uid);

        if (!user) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: "Error fetching profile" });
    }
};

// 3. Reapply for Teacher Account (Rejected → Pending)
export const reapplyTeacher = async (req: Request, res: Response) => {
    try {
        const uid = req.user?.uid; // From Auth Middleware
        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        // Get current user data
        const user = await getUserById(uid);

        if (!user) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        // Only allow teachers with "rejected" status to reapply
        if (user.role !== "teacher") {
            res.status(400).send({ message: "Only teachers can reapply" });
            return;
        }

        if (user.status !== "rejected") {
            res.status(400).send({ message: "You can only reapply if your application was rejected" });
            return;
        }

        // Change status from "rejected" to "pending"
        await updateUserStatus(uid, "pending");

        // Fetch updated user data
        const updatedUser = await getUserById(uid);

        res.status(200).send({
            message: "Reapplication submitted successfully. Your account is now pending admin approval.",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error in reapplyTeacher:", error);
        res.status(500).send({ message: "Error processing reapplication" });
    }
};
