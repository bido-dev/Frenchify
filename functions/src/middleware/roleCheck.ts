import { Request, Response, NextFunction } from "express";
import { db } from "../config/firebase";

// 1. Admin Check (For approving teachers/users)
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data();

        if (userData?.role === "admin") {
            next(); // User is Admin, proceed
        } else {
            res.status(403).send({ message: "Forbidden: Admins only" });
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// 2. Teacher Check (For creating courses)
export const isTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data();

        // Admins can always act as teachers
        if (userData?.role === "admin") {
            next();
            return;
        }

        // Teachers must have 'active' status (not 'pending' or 'rejected')
        if (userData?.role === "teacher" && userData?.status === "active") {
            next();
        } else if (userData?.role === "teacher" && userData?.status === "pending") {
            res.status(403).send({
                message: "Your teacher account is pending approval. Please wait for admin approval.",
                status: "pending"
            });
        } else if (userData?.role === "teacher" && userData?.status === "rejected") {
            res.status(403).send({
                message: "Your teacher account was rejected. Please contact support.",
                status: "rejected"
            });
        } else {
            res.status(403).send({ message: "Forbidden: Teachers only" });
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// 3. Paid Tier Check (For Downloads)
export const isPaidTier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data();

        if (userData?.tier === "paid" || userData?.role === "admin") {
            next();
        } else {
            res.status(403).send({ message: "Forbidden: Upgrade to Paid Tier required" });
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};