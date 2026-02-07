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

        // Allow Admins to act as Teachers too, if desired
        if (userData?.role === "teacher" || userData?.role === "admin") {
            next();
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