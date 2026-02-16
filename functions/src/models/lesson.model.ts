import { db } from "../config/firebase";

/**
 * Lesson Model - Database operations for lesson management
 * Lessons are sub-collections of courses
 */

export interface LessonData {
    title: string;
    video?: {
        type: 'youtube' | 'upload';
        url: string;
    };
    pdf?: {
        url: string;
        title: string;
    };
    materials?: {
        id: string;
        title: string;
        url: string;
        type: string;
    }[];
    quiz?: {
        id: string; // Placeholder for future quiz implementation
    };
    createdAt: string;
    updatedAt: string;
}

/**
 * Add a lesson to a course
 * @param courseId - Course document ID
 * @param lessonData - Lesson information
 * @returns Lesson document ID
 */
export const addLesson = async (
    courseId: string,
    lessonData: {
        title: string;
        video?: {
            type: 'youtube' | 'upload';
            url: string;
        };
        pdf?: {
            url: string;
            title: string;
        };
        materials?: {
            id: string;
            title: string;
            url: string;
            type: string;
        }[];
    }
): Promise<string> => {
    const newLesson = {
        title: lessonData.title,
        video: lessonData.video || null,
        pdf: lessonData.pdf || null,
        materials: lessonData.materials || [],
        quiz: null, // Placeholder
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const docRef = await db
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .add(newLesson);

    return docRef.id;
};

/**
 * Get all lessons for a course
 * @param courseId - Course document ID
 * @returns Array of lessons
 */
export const getCourseLessons = async (courseId: string): Promise<(LessonData & { id: string })[]> => {
    const snapshot = await db
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .orderBy("createdAt", "asc")
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as LessonData)
    }));
};

/**
 * Get a single lesson by ID
 * @param courseId - Course document ID
 * @param lessonId - Lesson document ID
 * @returns Lesson data or null
 */
export const getLessonById = async (
    courseId: string,
    lessonId: string
): Promise<LessonData | null> => {
    const doc = await db
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .doc(lessonId)
        .get();

    if (!doc.exists) return null;
    return doc.data() as LessonData;
};

/**
 * Update a lesson
 * @param courseId - Course document ID
 * @param lessonId - Lesson document ID
 * @param updates - Fields to update
 */
export const updateLesson = async (
    courseId: string,
    lessonId: string,
    updates: Partial<LessonData>
): Promise<void> => {
    await db
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .doc(lessonId)
        .update({
            ...updates,
            updatedAt: new Date().toISOString()
        });
};

/**
 * Delete a lesson
 * @param courseId - Course document ID
 * @param lessonId - Lesson document ID
 */
export const deleteLesson = async (
    courseId: string,
    lessonId: string
): Promise<void> => {
    await db
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .doc(lessonId)
        .delete();
};
