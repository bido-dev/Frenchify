import { Request, Response } from "express";
import * as lessonModel from "../models/lesson.model";
import { checkCourseOwnership } from "../models/course.model";

/**
 * Create a new lesson
 */
export const createLessonHandler = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };
        const { title, video, pdf, quiz, materials } = req.body;
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Verify ownership
        const isOwner = await checkCourseOwnership(courseId, userId);
        if (!isOwner) {
            return res.status(403).json({ message: "You do not own this course" });
        }

        // Validation
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const lessonId = await lessonModel.addLesson(courseId, {
            title,
            video,
            pdf,
            quiz,
            materials: materials
        });

        return res.status(201).json({ id: lessonId, message: "Lesson created successfully" });
    } catch (error: any) {
        console.error("Error creating lesson:", error);
        return res.status(500).json({ message: "Failed to create lesson" });
    }
};

/**
 * Get all lessons for a course
 */
export const getCourseLessonsHandler = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };
        const lessons = await lessonModel.getCourseLessons(courseId);
        return res.status(200).json(lessons);
    } catch (error: any) {
        console.error("Error fetching lessons:", error);
        return res.status(500).json({ message: "Failed to fetch lessons" });
    }
};

/**
 * Update a lesson
 */
export const updateLessonHandler = async (req: Request, res: Response) => {
    try {
        const { courseId, lessonId } = req.params as { courseId: string; lessonId: string };
        const updates = req.body;
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const isOwner = await checkCourseOwnership(courseId, userId);
        if (!isOwner) {
            return res.status(403).json({ message: "You do not own this course" });
        }

        await lessonModel.updateLesson(courseId, lessonId, updates);
        return res.status(200).json({ message: "Lesson updated successfully" });
    } catch (error: any) {
        console.error("Error updating lesson:", error);
        return res.status(500).json({ message: "Failed to update lesson" });
    }
};

/**
 * Delete a lesson
 */
export const deleteLessonHandler = async (req: Request, res: Response) => {
    try {
        const { courseId, lessonId } = req.params as { courseId: string; lessonId: string };
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const isOwner = await checkCourseOwnership(courseId, userId);
        if (!isOwner) {
            return res.status(403).json({ message: "You do not own this course" });
        }

        await lessonModel.deleteLesson(courseId, lessonId);
        return res.status(200).json({ message: "Lesson deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting lesson:", error);
        return res.status(500).json({ message: "Failed to delete lesson" });
    }
};
