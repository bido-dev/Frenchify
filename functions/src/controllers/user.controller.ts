import { Request, Response } from "express";
import { createOrUpdateUser, getUserById } from "../models/user.model";

// 1. Create/Sync User (Called after Signup)
export const syncUser = async (req: Request, res: Response) => {
    try {
        const { uid, email, role } = req.body;

        if (!uid || !email) {
            res.status(400).send({ message: "Missing fields" });
            return;
        }

        // Use model layer for database operation
        await createOrUpdateUser(uid, email, role);

        res.status(201).send({ message: "User synced successfully" });
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
