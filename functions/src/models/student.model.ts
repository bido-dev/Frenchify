import { db } from "../config/firebase";
import { getStudentEnrollments } from "./enrollment.model";

/**
 * Student Model - Database operations for student-specific features
 * All functions are pure database operations with no HTTP logic
 */

export interface StudentStats {
    enrolledCount: number;
    completedCount: number;
    totalHours: number;
    currentStreak: number;
}

export interface EnrolledCourseData {
    id: string;
    title: string;
    category: string;
    progress: number;
    enrolledAt: string;
    lastAccessedAt?: string;
}

/**
 * Get student statistics
 * @param userId - Student's UID
 * @returns Student statistics object
 */
export const getStudentStats = async (userId: string): Promise<StudentStats> => {
    const enrollments = await getStudentEnrollments(userId);

    const stats: StudentStats = {
        enrolledCount: enrollments.length,
        completedCount: enrollments.filter((e) => e.completedAt).length,
        totalHours: enrollments.reduce((sum, e) => sum + e.totalHours, 0),
        currentStreak: await calculateStreak(userId),
    };

    return stats;
};

/**
 * Get student's enrolled courses with details
 * @param userId - Student's UID
 * @returns Array of enrolled courses with progress
 */
export const getStudentEnrolledCourses = async (
    userId: string
): Promise<EnrolledCourseData[]> => {
    const enrollments = await getStudentEnrollments(userId);

    if (enrollments.length === 0) {
        return [];
    }

    // Get course details for each enrollment
    const coursePromises = enrollments.map(async (enrollment) => {
        const courseDoc = await db
            .collection("courses")
            .doc(enrollment.courseId)
            .get();

        if (!courseDoc.exists) {
            return null;
        }

        const courseData = courseDoc.data();
        return {
            id: courseDoc.id,
            title: courseData?.title || "Unknown Course",
            category: courseData?.category || "grammar",
            progress: enrollment.progress,
            enrolledAt: enrollment.enrolledAt,
            lastAccessedAt: enrollment.lastAccessedAt,
        };
    });

    const courses = await Promise.all(coursePromises);
    return courses.filter((c) => c !== null) as EnrolledCourseData[];
};

/**
 * Calculate student's current learning streak (simplified)
 * In a real app, you'd track daily learning activity
 * @param userId - Student's UID
 * @returns Current streak in days
 */
async function calculateStreak(userId: string): Promise<number> {
    // TODO: Implement actual streak calculation based on learning activity
    // For now, return a placeholder value
    // You would need a separate collection to track daily activity
    return 0;
}
