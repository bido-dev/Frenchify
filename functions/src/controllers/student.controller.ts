import { Request, Response } from "express";
import { getCourseById } from "../models/course.model";
import { db } from "../config/firebase";
import { getStudentStats, getStudentEnrolledCourses } from "../models/student.model";

/**
 * Get all published courses (Public endpoint)
 * GET /students/courses
 */
export const getCourses = async (req: Request, res: Response) => {
    try {
        const { category } = req.query; // Optional filter: 'grammar' | 'conversation'

        let query = db.collection("courses").where("status", "==", "published");

        if (category && (category === "grammar" || category === "conversation")) {
            query = query.where("category", "==", category);
        }

        const snapshot = await query.get();

        const courses = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).send(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).send({ message: "Error fetching courses" });
    }
};

/**
 * Get single course details (Public endpoint)
 * GET /students/courses/:id
 */
export const getCourseById_Handler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };

        const course = await getCourseById(id);

        if (!course) {
            res.status(404).send({ message: "Course not found" });
            return;
        }

        res.status(200).send({ id, ...course });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).send({ message: "Error fetching course" });
    }
};

/**
 * Get course materials with tier enforcement
 * GET /students/courses/:id/materials
 * - Free tier: Only materials where isFreePreview === true
 * - Paid tier: All materials
 */
export const getCourseMaterials = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const userTier = req.user?.tier || "free"; // From auth middleware or default to free

        // Get all materials for the course
        const snapshot = await db
            .collection("courses")
            .doc(id)
            .collection("materials")
            .get();

        let materials = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filter based on tier (PRD 3.2)
        if (userTier === "free") {
            materials = materials.filter((material: any) => material.isFreePreview === true);
        }

        res.status(200).send(materials);
    } catch (error) {
        console.error("Error fetching materials:", error);
        res.status(500).send({ message: "Error fetching materials" });
    }
};

/**
 * Get student statistics
 * GET /students/stats
 * Requires authentication
 */
export const getStats = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        const stats = await getStudentStats(req.user.uid);
        res.status(200).send(stats);
    } catch (error) {
        console.error("Error fetching student stats:", error);
        res.status(500).send({ message: "Error fetching student stats" });
    }
};

/**
 * Get student's enrolled courses
 * GET /students/enrolled
 * Requires authentication
 */
export const getEnrolledCourses = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        const enrolledCourses = await getStudentEnrolledCourses(req.user.uid);
        res.status(200).send(enrolledCourses);
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        res.status(500).send({ message: "Error fetching enrolled courses" });
    }
};

