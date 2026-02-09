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
 * Get all users (admin only)
 * @returns Promise<any[]>
 */
export const getAllUsers = async (): Promise<any[]> => {
    const snapshot = await db
        .collection("users")
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
    }));
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
 * Delete all data associated with a teacher
 * - Courses owned by the teacher
 * - Materials within those courses
 * - Questions within those courses
 */
const deleteTeacherData = async (teacherId: string): Promise<void> => {
    // Get all courses owned by this teacher
    const coursesSnapshot = await db
        .collection("courses")
        .where("teacherId", "==", teacherId)
        .get();

    // Delete each course and its subcollections
    const batch = db.batch();
    for (const courseDoc of coursesSnapshot.docs) {
        const courseId = courseDoc.id;

        // Delete materials subcollection
        const materialsSnapshot = await db
            .collection("courses")
            .doc(courseId)
            .collection("materials")
            .get();
        materialsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

        // Delete questions subcollection
        const questionsSnapshot = await db
            .collection("courses")
            .doc(courseId)
            .collection("questions")
            .get();
        questionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

        // Delete course document
        batch.delete(courseDoc.ref);
    }

    await batch.commit();
};

/**
 * Delete all data associated with a student
 * - Enrollments
 * - Questions posted by the student
 */
const deleteStudentData = async (studentId: string): Promise<void> => {
    const batch = db.batch();

    // Delete enrollments
    const enrollmentsSnapshot = await db
        .collection("enrollments")
        .where("studentId", "==", studentId)
        .get();
    enrollmentsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Delete questions posted by this student across all courses
    const coursesSnapshot = await db.collection("courses").get();
    for (const courseDoc of coursesSnapshot.docs) {
        const questionsSnapshot = await db
            .collection("courses")
            .doc(courseDoc.id)
            .collection("questions")
            .where("userId", "==", studentId)
            .get();
        questionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    }

    await batch.commit();
};

/**
 * Delete user account completely (Auth + Database)
 * @param uid - User ID
 * @returns Promise<void>
 */
export const deleteUserAccount = async (uid: string): Promise<void> => {
    // 1. Get user data to determine role
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
        throw new Error("User not found");
    }

    const userData = userDoc.data();
    const role = userData?.role;

    // 2. Role-specific cascade deletions
    if (role === "teacher") {
        await deleteTeacherData(uid);
    } else if (role === "student") {
        await deleteStudentData(uid);
    }

    // 3. Delete from Authentication
    await auth.deleteUser(uid);

    // 4. Delete from Database
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
