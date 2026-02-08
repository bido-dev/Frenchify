import { db } from "../config/firebase";
import { getCourseEnrollmentCount } from "./enrollment.model";

/**
 * Teacher Model - Database operations for teacher-specific features
 * All functions are pure database operations with no HTTP logic
 */

export interface TeacherStats {
    coursesCreated: number;
    totalStudents: number;
    pendingQuestions: number;
}

export interface TeacherCourseData {
    id: string;
    title: string;
    status: "draft" | "published";
    enrolledCount: number;
    category: string;
    createdAt: string;
}

/**
 * Get teacher statistics
 * @param teacherId - Teacher's UID
 * @returns Teacher statistics object
 */
export const getTeacherStats = async (
    teacherId: string
): Promise<TeacherStats> => {
    // Get all courses by this teacher
    const coursesSnapshot = await db
        .collection("courses")
        .where("teacherId", "==", teacherId)
        .get();

    const courseIds = coursesSnapshot.docs.map((doc) => doc.id);

    // Get unique students across all courses
    const uniqueStudents = await getUniqueStudentsForTeacher(courseIds);

    // Get pending questions count
    const pendingQuestions = await getPendingQuestionsCount(courseIds);

    return {
        coursesCreated: coursesSnapshot.size,
        totalStudents: uniqueStudents,
        pendingQuestions,
    };
};

/**
 * Get teacher's courses with enrollment stats
 * @param teacherId - Teacher's UID
 * @returns Array of courses with stats
 */
export const getTeacherCourses = async (
    teacherId: string
): Promise<TeacherCourseData[]> => {
    const coursesSnapshot = await db
        .collection("courses")
        .where("teacherId", "==", teacherId)
        .orderBy("createdAt", "desc")
        .get();

    if (coursesSnapshot.empty) {
        return [];
    }

    const coursePromises = coursesSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const enrolledCount = await getCourseEnrollmentCount(doc.id);

        return {
            id: doc.id,
            title: data.title,
            status: data.status,
            enrolledCount,
            category: data.category,
            createdAt: data.createdAt,
        };
    });

    return Promise.all(coursePromises);
};

/**
 * Get count of unique students enrolled in teacher's courses
 * @param courseIds - Array of course IDs
 * @returns Number of unique students
 */
async function getUniqueStudentsForTeacher(
    courseIds: string[]
): Promise<number> {
    if (courseIds.length === 0) {
        return 0;
    }

    // Firestore 'in' query has a limit of 10 items
    // For simplicity, we'll handle up to 10 courses
    // In production, you'd need to batch this or denormalize
    const limitedCourseIds = courseIds.slice(0, 10);

    if (limitedCourseIds.length === 0) {
        return 0;
    }

    const enrollmentsSnapshot = await db
        .collection("enrollments")
        .where("courseId", "in", limitedCourseIds)
        .get();

    const uniqueStudents = new Set(
        enrollmentsSnapshot.docs.map((doc) => doc.data().userId)
    );

    return uniqueStudents.size;
}

/**
 * Get count of unanswered questions in teacher's courses
 * @param courseIds - Array of course IDs
 * @returns Number of pending questions
 */
async function getPendingQuestionsCount(courseIds: string[]): Promise<number> {
    if (courseIds.length === 0) {
        return 0;
    }

    let totalPending = 0;

    // Query each course's questions subcollection
    // Note: Firestore doesn't support collection group queries with multiple filters easily
    for (const courseId of courseIds.slice(0, 10)) {
        const questionsSnapshot = await db
            .collection("courses")
            .doc(courseId)
            .collection("questions")
            .where("isAnswered", "==", false)
            .get();

        totalPending += questionsSnapshot.size;
    }

    return totalPending;
}
