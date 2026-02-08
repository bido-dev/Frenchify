import { auth } from "../config/firebase";
import { updateUserStatus, updateUserTier, deleteUserFromDb } from "./user.model";
import { db } from "../config/firebase";

/**
 * Admin Model - Admin-specific database operations
 * Wraps user model functions with admin context
 */

export interface PendingTeacherData {
    uid: string;
    email: string;
    name?: string;
    createdAt: string;
    status: "pending";
}

/**
 * Get all pending teachers awaiting approval
 * @returns Promise<PendingTeacherData[]>
 */
export const getPendingTeachers = async (): Promise<PendingTeacherData[]> => {
    const snapshot = await db
        .collection("users")
        .where("role", "==", "teacher")
        .where("status", "==", "pending")
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            uid: doc.id,
            email: data.email,
            name: data.name,
            createdAt: data.createdAt,
            status: "pending" as const
        };
    });
};

/**
 * Update teacher status (approve/reject)
 * @param uid - Teacher's UID
 * @param status - New status
 * @returns Promise<void>
 */
export const updateTeacherStatus = async (
    uid: string,
    status: "active" | "rejected"
): Promise<void> => {
    await updateUserStatus(uid, status);
};

/**
 * Update user subscription tier (manual override)
 * @param uid - User ID
 * @param tier - Subscription tier
 * @returns Promise<void>
 */
export const updateUserSubscription = async (
    uid: string,
    tier: "free" | "paid"
): Promise<void> => {
    await updateUserTier(uid, tier);
};

/**
 * Delete user account completely (Auth + Database)
 * @param uid - User ID
 * @returns Promise<void>
 */
export const deleteUserAccount = async (uid: string): Promise<void> => {
    // Delete from Authentication
    await auth.deleteUser(uid);

    // Delete from Database
    await deleteUserFromDb(uid);
};

/**
 * Create a new admin account (Admin-only operation per PRD 3.4)
 * @param email - Admin email
 * @param password - Admin password
 * @param name - Optional admin full name
 * @returns Promise<string> - New admin UID
 */
export const createAdmin = async (
    email: string,
    password: string,
    name?: string
): Promise<string> => {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
        email,
        password,
        emailVerified: false
    });

    // Create user document in Firestore with admin role
    const adminData: any = {
        uid: userRecord.uid,
        email,
        role: "admin",
        tier: "paid", // Admins get paid tier by default
        status: "active",
        createdAt: new Date().toISOString()
    };

    // Add name if provided
    if (name) {
        adminData.name = name;
    }

    await db.collection("users").doc(userRecord.uid).set(adminData);

    return userRecord.uid;
};
