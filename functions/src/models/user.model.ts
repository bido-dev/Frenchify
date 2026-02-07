import { db } from "../config/firebase";

/**
 * User Model - Database operations for user management
 * All functions are pure database operations with no HTTP logic
 */

export interface UserData {
    uid: string;
    email: string;
    role: "student" | "teacher";
    tier: "free" | "paid";
    status: "active" | "pending" | "rejected";
    createdAt: string;
}

/**
 * Create or update a user in Firestore
 * @param uid - User ID from Firebase Auth
 * @param email - User email
 * @param role - User role (student or teacher)
 * @returns Promise<void>
 */
export const createOrUpdateUser = async (
    uid: string,
    email: string,
    role: "student" | "teacher" = "student"
): Promise<void> => {
    const userRef = db.collection("users").doc(uid);

    await userRef.set({
        uid,
        email,
        role,
        tier: "free", // ALWAYS default to free [PRD 3.1]
        createdAt: new Date().toISOString(),
        status: role === "teacher" ? "pending" : "active" // Teachers need approval [PRD 3.4]
    }, { merge: true });
};

/**
 * Get user by UID
 * @param uid - User ID
 * @returns User data or null if not found
 */
export const getUserById = async (uid: string): Promise<UserData | null> => {
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
        return null;
    }

    return userDoc.data() as UserData;
};

/**
 * Update user status (for teacher approval/rejection)
 * @param uid - User ID
 * @param status - New status
 * @returns Promise<void>
 */
export const updateUserStatus = async (
    uid: string,
    status: "active" | "pending" | "rejected"
): Promise<void> => {
    await db.collection("users").doc(uid).update({
        status
    });
};

/**
 * Update user subscription tier
 * @param uid - User ID
 * @param tier - Subscription tier
 * @returns Promise<void>
 */
export const updateUserTier = async (
    uid: string,
    tier: "free" | "paid"
): Promise<void> => {
    await db.collection("users").doc(uid).update({
        tier
    });
};

/**
 * Delete user from Firestore database
 * @param uid - User ID
 * @returns Promise<void>
 */
export const deleteUserFromDb = async (uid: string): Promise<void> => {
    await db.collection("users").doc(uid).delete();
};
