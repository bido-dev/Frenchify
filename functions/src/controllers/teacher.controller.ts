import { Request, Response } from "express";
import { getTeacherStats, getTeacherCourses } from "../models/teacher.model";

/**
 * Teacher Controller - HTTP handlers for teacher-specific endpoints
 */

/**
 * Get teacher statistics
 * GET /teachers/stats
 * Requires authentication + isTeacher middleware
 */
export const getStats = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        const stats = await getTeacherStats(req.user.uid);
        res.status(200).send(stats);
    } catch (error) {
        console.error("Error fetching teacher stats:", error);
        res.status(500).send({ message: "Error fetching teacher stats" });
    }
};

/**
 * Get teacher's courses with stats
 * GET /teachers/courses
 * Requires authentication + isTeacher middleware
 */
export const getCourses = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        const courses = await getTeacherCourses(req.user.uid);
        res.status(200).send(courses);
    } catch (error) {
        console.error("Error fetching teacher courses:", error);
        res.status(500).send({ message: "Error fetching teacher courses" });
    }
};
