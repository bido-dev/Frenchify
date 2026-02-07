import { db } from "../config/firebase";

/**
 * Course Model - Database operations for course management
 * All functions are pure database operations with no HTTP logic
 */

export interface CourseData {
    teacherId: string;
    title: string;
    description: string;
    category: "grammar" | "conversation";
    isPaid: boolean;
    status: "draft" | "published";
    createdAt: string;
    updatedAt: string;
}

export interface MaterialData {
    title: string;
    type: "video" | "youtube" | "quiz" | "pdf";
    url: string;
    isFreePreview: boolean;
    createdAt: string;
}

/**
 * Create a new course in Firestore
 * @param teacherId - Teacher's UID
 * @param courseData - Course information
 * @returns Course document ID
 */
export const createCourse = async (
    teacherId: string,
    courseData: {
        title: string;
        description: string;
        category: "grammar" | "conversation";
        isPaid?: boolean;
    }
): Promise<string> => {
    const newCourse = {
        teacherId,
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        isPaid: courseData.isPaid || false,
        status: "draft", // Always default to draft until published [PRD 8]
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection("courses").add(newCourse);
    return docRef.id;
};

/**
 * Get course by ID
 * @param courseId - Course document ID
 * @returns Course data or null if not found
 */
export const getCourseById = async (courseId: string): Promise<CourseData | null> => {
    const courseDoc = await db.collection("courses").doc(courseId).get();

    if (!courseDoc.exists) {
        return null;
    }

    return courseDoc.data() as CourseData;
};

/**
 * Check if a user owns a specific course
 * @param courseId - Course document ID
 * @param uid - User ID to check
 * @returns True if user owns the course, false otherwise
 */
export const checkCourseOwnership = async (
    courseId: string,
    uid: string
): Promise<boolean> => {
    const courseDoc = await db.collection("courses").doc(courseId).get();

    if (!courseDoc.exists) {
        return false;
    }

    return courseDoc.data()?.teacherId === uid;
};

/**
 * Add material to a course's materials subcollection
 * @param courseId - Course document ID
 * @param materialData - Material information
 * @returns Material document ID
 */
export const addMaterialToCourse = async (
    courseId: string,
    materialData: {
        title: string;
        type: "video" | "youtube" | "quiz" | "pdf";
        url: string;
        isFreePreview?: boolean;
    }
): Promise<string> => {
    const newMaterial = {
        title: materialData.title,
        type: materialData.type,
        url: materialData.url,
        isFreePreview: materialData.isFreePreview || false, // [PRD 10]
        createdAt: new Date().toISOString()
    };

    const docRef = await db
        .collection("courses")
        .doc(courseId)
        .collection("materials")
        .add(newMaterial);

    return docRef.id;
};

/**
 * Update course status (draft/published)
 * @param courseId - Course document ID
 * @param status - New status
 * @returns Promise<void>
 */
export const updateCourseStatus = async (
    courseId: string,
    status: "draft" | "published"
): Promise<void> => {
    await db.collection("courses").doc(courseId).update({
        status,
        updatedAt: new Date().toISOString()
    });
};

/**
 * Update course data (title, description, etc.)
 * @param courseId - Course document ID
 * @param updates - Fields to update
 * @returns Promise<void>
 */
export const updateCourse = async (
    courseId: string,
    updates: {
        title?: string;
        description?: string;
        category?: "grammar" | "conversation";
        isPaid?: boolean;
    }
): Promise<void> => {
    await db.collection("courses").doc(courseId).update({
        ...updates,
        updatedAt: new Date().toISOString()
    });
};

/**
 * Delete a course and all its subcollections
 * @param courseId - Course document ID
 * @returns Promise<void>
 */
export const deleteCourse = async (courseId: string): Promise<void> => {
    // Note: In production, you should delete subcollections (materials, questions) first
    // For now, we'll just delete the main document
    // Consider using Firebase Cloud Functions to handle cascading deletes
    await db.collection("courses").doc(courseId).delete();
};

/**
 * Get a single material by ID
 * @param courseId - Course document ID
 * @param materialId - Material document ID
 * @returns Material data or null if not found
 */
export const getMaterialById = async (
    courseId: string,
    materialId: string
): Promise<MaterialData | null> => {
    const materialDoc = await db
        .collection("courses")
        .doc(courseId)
        .collection("materials")
        .doc(materialId)
        .get();

    if (!materialDoc.exists) {
        return null;
    }

    return materialDoc.data() as MaterialData;
};

/**
 * Update a material in a course
 * @param courseId - Course document ID
 * @param materialId - Material document ID  
 * @param updates - Fields to update
 * @returns Promise<void>
 */
export const updateMaterial = async (
    courseId: string,
    materialId: string,
    updates: {
        title?: string;
        type?: "video" | "youtube" | "quiz" | "pdf";
        url?: string;
        isFreePreview?: boolean;
    }
): Promise<void> => {
    await db
        .collection("courses")
        .doc(courseId)
        .collection("materials")
        .doc(materialId)
        .update(updates);
};

/**
 * Delete a material from a course
 * @param courseId - Course document ID
 * @param materialId - Material document ID
 * @returns Promise<void>
 */
export const deleteMaterial = async (
    courseId: string,
    materialId: string
): Promise<void> => {
    await db
        .collection("courses")
        .doc(courseId)
        .collection("materials")
        .doc(materialId)
        .delete();
};
