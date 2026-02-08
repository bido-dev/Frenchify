import { db } from "../config/firebase";

/**
 * Enrollment Model - Database operations for student course enrollments
 * All functions are pure database operations with no HTTP logic
 */

export interface EnrollmentData {
    userId: string;
    courseId: string;
    enrolledAt: string;
    progress: number; // 0-100
    completedAt?: string;
    totalHours: number;
    lastAccessedAt?: string;
}

/**
 * Create a new enrollment record
 * @param userId - Student's UID
 * @param courseId - Course ID
 * @returns Enrollment document ID
 */
export const createEnrollment = async (
    userId: string,
    courseId: string
): Promise<string> => {
    const newEnrollment: EnrollmentData = {
        userId,
        courseId,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        totalHours: 0,
    };

    const docRef = await db.collection("enrollments").add(newEnrollment);
    return docRef.id;
};

/**
 * Get an enrollment by user and course
 * @param userId - Student's UID
 * @param courseId - Course ID
 * @returns Enrollment data or null if not found
 */
export const getEnrollment = async (
    userId: string,
    courseId: string
): Promise<EnrollmentData | null> => {
    const snapshot = await db
        .collection("enrollments")
        .where("userId", "==", userId)
        .where("courseId", "==", courseId)
        .limit(1)
        .get();

    if (snapshot.empty) {
        return null;
    }

    return snapshot.docs[0].data() as EnrollmentData;
};

/**
 * Get all enrollments for a student
 * @param userId - Student's UID
 * @returns Array of enrollment data
 */
export const getStudentEnrollments = async (
    userId: string
): Promise<EnrollmentData[]> => {
    const snapshot = await db
        .collection("enrollments")
        .where("userId", "==", userId)
        .get();

    return snapshot.docs.map((doc) => doc.data() as EnrollmentData);
};

/**
 * Update enrollment progress
 * @param userId - Student's UID
 * @param courseId - Course ID
 * @param progress - New progress (0-100)
 * @param hoursToAdd - Hours to add to total
 * @returns Promise<void>
 */
export const updateEnrollmentProgress = async (
    userId: string,
    courseId: string,
    progress: number,
    hoursToAdd: number = 0
): Promise<void> => {
    const snapshot = await db
        .collection("enrollments")
        .where("userId", "==", userId)
        .where("courseId", "==", courseId)
        .limit(1)
        .get();

    if (snapshot.empty) {
        throw new Error("Enrollment not found");
    }

    const enrollmentDoc = snapshot.docs[0];
    const currentData = enrollmentDoc.data() as EnrollmentData;

    const updates: any = {
        progress,
        totalHours: currentData.totalHours + hoursToAdd,
        lastAccessedAt: new Date().toISOString(),
    };

    // Mark as completed if progress is 100%
    if (progress === 100 && !currentData.completedAt) {
        updates.completedAt = new Date().toISOString();
    }

    await enrollmentDoc.ref.update(updates);
};

/**
 * Get count of enrollments for a specific course
 * @param courseId - Course ID
 * @returns Number of students enrolled
 */
export const getCourseEnrollmentCount = async (
    courseId: string
): Promise<number> => {
    const snapshot = await db
        .collection("enrollments")
        .where("courseId", "==", courseId)
        .get();

    return snapshot.size;
};

/**
 * Get total number of students enrolled in all courses by a teacher
 * @param teacherId - Teacher's UID
 * @returns Total student count across all teacher's courses
 */
export const getTeacherTotalStudents = async (
    teacherId: string
): Promise<number> => {
    // First, get all courses by this teacher
    const coursesSnapshot = await db
        .collection("courses")
        .where("teacherId", "==", teacherId)
        .get();

    if (coursesSnapshot.empty) {
        return 0;
    }

    const courseIds = coursesSnapshot.docs.map((doc) => doc.id);

    // Get unique student IDs enrolled in any of these courses
    const enrollmentsSnapshot = await db
        .collection("enrollments")
        .where("courseId", "in", courseIds.slice(0, 10)) // Firestore 'in' limit is 10
        .get();

    const uniqueStudents = new Set(
        enrollmentsSnapshot.docs.map((doc) => doc.data().userId)
    );

    return uniqueStudents.size;
};
